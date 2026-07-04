import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMock = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { POST, __resetRateLimitForTest } from "../route";
import {
  EMPTY_SUBMISSION,
  type OpportunityMapSubmission,
} from "@/app/components/OpportunityMap/schema";

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

function validSubmission(): OpportunityMapSubmission {
  const s = clone(EMPTY_SUBMISSION);
  s.company = {
    companyName: "Acme",
    website: "",
    industry: "tech",
    companySize: "51-200",
    stage: "scaling",
    mainPressure: "growth",
  };
  s.business = {
    priorityOutcomes: ["cost"],
    urgentArea: "operations",
    timeframe: "asap",
  };
  s.process = { ...s.process, manualWorkLevel: "4" };
  s.team = { ...s.team, overloadedFunctions: ["operations"] };
  s.contact = {
    contactName: "Dana",
    email: "dana@acme.com",
    role: "founderExec",
    company: "Acme",
    phone: "",
    companyLinkedin: "",
    consent: true,
  };
  return s;
}

let ipCounter = 0;
function nextIp() {
  ipCounter += 1;
  return `203.0.113.${ipCounter}`;
}

function makeRequest(body: unknown, ip?: string) {
  return new Request("http://localhost/api/opportunity-map", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip ?? nextIp(),
    },
    body: JSON.stringify(body),
  });
}

async function jsonBody(res: Response) {
  return res.json() as Promise<{
    ok?: boolean;
    error?: string;
    issues?: string[];
    delivery?: string;
  }>;
}

describe("/api/opportunity-map POST", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("CONTACT_FROM_EMAIL", "Honto <hello@honto.ai>");
    vi.stubEnv("OPPORTUNITY_MAP_TO_EMAIL", "aumerez@honto.ai");
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "mail_1" }, error: null });
    __resetRateLimitForTest();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("validation", () => {
    it("returns 400 on malformed JSON", async () => {
      const req = new Request("http://localhost/api/opportunity-map", {
        method: "POST",
        headers: { "x-forwarded-for": nextIp() },
        body: "not-json{",
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("rejects a missing contact email", async () => {
      const s = validSubmission();
      s.contact.email = "";
      const res = await POST(makeRequest({ submission: s }));
      expect(res.status).toBe(400);
      const body = await jsonBody(res);
      expect(body.ok).toBe(false);
      expect(body.issues?.some((i) => /email/i.test(i))).toBe(true);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("rejects an invalid email", async () => {
      const s = validSubmission();
      s.contact.email = "nope";
      const res = await POST(makeRequest({ submission: s }));
      expect(res.status).toBe(400);
      expect(
        (await jsonBody(res)).issues?.some((i) => /valid email/i.test(i))
      ).toBe(true);
    });

    it("rejects an invalid website when provided", async () => {
      const s = validSubmission();
      s.company.website = "not a url";
      const res = await POST(makeRequest({ submission: s }));
      expect(res.status).toBe(400);
      expect(
        (await jsonBody(res)).issues?.some((i) => /website/i.test(i))
      ).toBe(true);
    });

    it("rejects banned/private fields", async () => {
      const s = validSubmission() as unknown as Record<string, unknown>;
      (s as { password?: string }).password = "hunter2";
      const res = await POST(makeRequest({ submission: s }));
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });
  });

  describe("delivery", () => {
    it("sends an internal lead with the correct subject and required fields", async () => {
      const res = await POST(makeRequest({ submission: validSubmission() }));
      expect(res.status).toBe(200);
      expect((await jsonBody(res)).delivery).toBe("sent");
      expect(sendMock).toHaveBeenCalledTimes(1);

      const args = sendMock.mock.calls[0][0] as {
        to: string[];
        replyTo: string;
        subject: string;
        text: string;
      };
      expect(args.to).toEqual(["aumerez@honto.ai"]);
      expect(args.replyTo).toBe("dana@acme.com");
      expect(args.subject).toMatch(
        /^New Honto AI Readiness Lead — Acme — Signal \d+\/100$/
      );
      for (const field of [
        "AI opportunity signal",
        "Implementation complexity",
        "Estimated first phase",
        "Suggested sales angle",
        "Suggested first review/demo",
        "Top 3 first moves",
        "Most overloaded areas",
        "Current stack",
        "Integration readiness",
        "Data readiness",
        "Security requirement",
      ]) {
        expect(args.text).toContain(field);
      }
    });

    it("accepts the skip-tech path and notes the skipped stack", async () => {
      const s = validSubmission();
      s.techStack = null;
      s.techSkipped = true;
      const res = await POST(makeRequest({ submission: s }));
      expect(res.status).toBe(200);
      expect((await jsonBody(res)).delivery).toBe("sent");
      const args = sendMock.mock.calls[0][0] as { text: string };
      expect(args.text).toContain("Current stack: Skipped");
      expect(args.text).toContain("Integration readiness: Not provided");
    });

    it("stubs delivery in local dev when email is not configured", async () => {
      vi.stubEnv("RESEND_API_KEY", "");
      const res = await POST(makeRequest({ submission: validSubmission() }));
      expect(res.status).toBe(200);
      expect((await jsonBody(res)).delivery).toBe("stub");
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("fails closed in production when email is not configured", async () => {
      vi.stubEnv("RESEND_API_KEY", "");
      vi.stubEnv("NODE_ENV", "production");
      const res = await POST(makeRequest({ submission: validSubmission() }));
      expect(res.status).toBe(500);
      expect((await jsonBody(res)).ok).toBe(false);
    });

    it("returns a safe response (no leaked details) on delivery failure", async () => {
      sendMock.mockResolvedValueOnce({
        data: null,
        error: { statusCode: 403, message: "domain not verified", name: "x" },
      });
      const res = await POST(makeRequest({ submission: validSubmission() }));
      expect(res.status).toBe(200);
      const body = await jsonBody(res);
      expect(body.ok).toBe(true);
      expect(body.delivery).toBe("failed");
      expect(JSON.stringify(body)).not.toContain("403");
      expect(JSON.stringify(body)).not.toMatch(/domain not verified/);
    });
  });

  describe("rate limiting", () => {
    it("allows three requests then blocks the fourth", async () => {
      const ip = "198.51.100.7";
      const r1 = await POST(makeRequest({ submission: validSubmission() }, ip));
      const r2 = await POST(makeRequest({ submission: validSubmission() }, ip));
      const r3 = await POST(makeRequest({ submission: validSubmission() }, ip));
      const r4 = await POST(makeRequest({ submission: validSubmission() }, ip));
      expect([r1.status, r2.status, r3.status]).toEqual([200, 200, 200]);
      expect(r4.status).toBe(429);
    });
  });
});
