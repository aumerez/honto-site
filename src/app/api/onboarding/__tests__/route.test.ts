import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMock = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { POST, __resetRateLimitForTest } from "../route";
import {
  EMPTY_ANSWERS,
  type Answers,
} from "@/app/components/Onboarding/schema";

let ipCounter = 0;
function nextIp() {
  ipCounter += 1;
  return `203.0.113.${ipCounter}`;
}

function makeRequest(body: unknown, rawBody?: string, ip?: string) {
  const text = rawBody ?? JSON.stringify(body);
  return new Request("http://localhost/api/onboarding", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip ?? nextIp(),
    },
    body: text,
  });
}

async function jsonBody(response: Response) {
  return response.json() as Promise<{ ok?: true; error?: string }>;
}

function validAnswers(overrides: Partial<Answers["step1"]> = {}): Answers {
  const fresh = structuredClone(EMPTY_ANSWERS);
  fresh.step1 = {
    ...fresh.step1,
    companyName: "Honto Demo",
    contactName: "Demo User",
    email: "demo@example.com",
    industry: "tech",
    companySize: "51-200",
    ...overrides,
  };
  return fresh;
}

describe("/api/onboarding POST", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("CONTACT_FROM_EMAIL", "Honto <hello@honto.ai>");
    vi.stubEnv("ONBOARDING_TO_EMAIL", "aumerez@honto.ai");
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "mail_abc" }, error: null });
    __resetRateLimitForTest();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("configuration errors", () => {
    it("returns 500 when RESEND_API_KEY is missing", async () => {
      vi.stubEnv("RESEND_API_KEY", "");
      const res = await POST(makeRequest({ answers: validAnswers() }));
      expect(res.status).toBe(500);
      expect((await jsonBody(res)).error).toMatch(/not configured/i);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 500 when ONBOARDING_TO_EMAIL is missing", async () => {
      vi.stubEnv("ONBOARDING_TO_EMAIL", "");
      const res = await POST(makeRequest({ answers: validAnswers() }));
      expect(res.status).toBe(500);
      expect(sendMock).not.toHaveBeenCalled();
    });
  });

  describe("request validation", () => {
    it("returns 400 on malformed JSON", async () => {
      const res = await POST(makeRequest(null, "not-json{"));
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 400 when step1 contact name is missing", async () => {
      const a = validAnswers();
      a.step1.contactName = "";
      const res = await POST(makeRequest({ answers: a }));
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 400 when step1 email is malformed", async () => {
      const a = validAnswers({ email: "not-an-email" });
      const res = await POST(makeRequest({ answers: a }));
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 400 when industry is missing", async () => {
      const a = validAnswers();
      a.step1.industry = "";
      const res = await POST(makeRequest({ answers: a }));
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 400 when phone is non-numeric", async () => {
      const a = validAnswers({ phone: "+1 555 123" });
      const res = await POST(makeRequest({ answers: a }));
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 400 when a free-text field exceeds its limit", async () => {
      const a = validAnswers();
      a.step5.notes = "x".repeat(1001);
      const res = await POST(makeRequest({ answers: a }));
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("silently drops unknown enum values for non-required fields", async () => {
      const a = validAnswers();
      // crm option must come from SYSTEM_OPTIONS.crm; unknown values get dropped
      (a.step2.crm as unknown as string[]) = ["salesforce", "bogus-crm"];
      const res = await POST(makeRequest({ answers: a }));
      expect(res.status).toBe(200);
      const args = sendMock.mock.calls[0][0] as { text: string };
      expect(args.text).toContain("CRM: salesforce");
      expect(args.text).not.toContain("bogus-crm");
    });
  });

  describe("happy path", () => {
    it("sends with minimal valid answers", async () => {
      const res = await POST(makeRequest({ answers: validAnswers() }));
      expect(res.status).toBe(200);
      expect((await jsonBody(res)).ok).toBe(true);
      expect(sendMock).toHaveBeenCalledTimes(1);

      const args = sendMock.mock.calls[0][0] as {
        from: string;
        to: string[];
        replyTo: string;
        subject: string;
        text: string;
        html: string;
        attachments: { filename: string; content: string }[];
      };
      expect(args.from).toBe("Honto <hello@honto.ai>");
      expect(args.to).toEqual(["aumerez@honto.ai"]);
      expect(args.replyTo).toBe("demo@example.com");
      expect(args.subject).toMatch(
        /^New AI Readiness — Honto Demo \(\d+\/100, [SMLX]+\)$/
      );
      expect(args.text).toContain("Score:");
      expect(args.text).toContain("Sizing:");
      expect(args.text).toContain("Company: Honto Demo");
      expect(args.html).toContain("AI Readiness Submission");
    });

    it("attaches a JSON file with the raw answers and computed score/sizing", async () => {
      const a = validAnswers();
      a.step4.currentUse = "production";
      a.step4.priorProjects = "production";
      a.step5.outcomes = ["cost", "speed"];
      const res = await POST(makeRequest({ answers: a }));
      expect(res.status).toBe(200);

      const args = sendMock.mock.calls[0][0] as {
        attachments: { filename: string; content: string }[];
      };
      expect(args.attachments).toHaveLength(1);
      expect(args.attachments[0].filename).toMatch(/^onboarding-\d+\.json$/);

      const decoded = JSON.parse(
        Buffer.from(args.attachments[0].content, "base64").toString("utf8")
      ) as {
        submittedAt: string;
        answers: Answers;
        score: { total: number; band: string };
        sizing: { size: string; weeksMin: number };
      };
      expect(decoded.answers.step1.companyName).toBe("Honto Demo");
      expect(decoded.answers.step5.outcomes).toEqual(["cost", "speed"]);
      expect(typeof decoded.score.total).toBe("number");
      expect(typeof decoded.sizing.size).toBe("string");
      expect(decoded.submittedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it("escapes HTML in user-controlled fields", async () => {
      const a = validAnswers({
        companyName: '<script>alert("xss")</script>',
      });
      a.step5.notes = "<img src=x onerror=1>";
      await POST(makeRequest({ answers: a }));
      const args = sendMock.mock.calls[0][0] as { html: string };
      expect(args.html).not.toContain("<script>");
      expect(args.html).not.toContain("<img src=x");
      expect(args.html).toContain("&lt;script&gt;");
      expect(args.html).toContain("&lt;img src=x onerror=1&gt;");
    });
  });

  describe("downstream failure", () => {
    it("returns 502 and logs when Resend rejects the send", async () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      sendMock.mockResolvedValueOnce({
        data: null,
        error: {
          statusCode: 403,
          message: "The domain is not verified.",
          name: "validation_error",
        },
      });

      const res = await POST(makeRequest({ answers: validAnswers() }));
      expect(res.status).toBe(502);
      expect(errorSpy).toHaveBeenCalledWith(
        "[/api/onboarding] Resend error:",
        expect.objectContaining({ statusCode: 403 })
      );
      errorSpy.mockRestore();
    });
  });

  describe("rate limiting", () => {
    it("allows two requests from the same IP and blocks the third", async () => {
      const ip = "198.51.100.50";
      const r1 = await POST(
        makeRequest({ answers: validAnswers() }, undefined, ip)
      );
      const r2 = await POST(
        makeRequest({ answers: validAnswers() }, undefined, ip)
      );
      const r3 = await POST(
        makeRequest({ answers: validAnswers() }, undefined, ip)
      );
      expect(r1.status).toBe(200);
      expect(r2.status).toBe(200);
      expect(r3.status).toBe(429);
      expect(r3.headers.get("Retry-After")).toMatch(/^\d+$/);
      expect(sendMock).toHaveBeenCalledTimes(2);
    });
  });
});
