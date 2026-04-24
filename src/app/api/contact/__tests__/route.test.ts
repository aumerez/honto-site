import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const sendMock = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

import { POST, __resetRateLimitForTest } from "../route";

let ipCounter = 0;
function nextIp() {
  ipCounter += 1;
  return `203.0.113.${ipCounter}`;
}

function makeRequest(body: unknown, rawBody?: string, ip?: string) {
  const text = rawBody ?? JSON.stringify(body);
  return new Request("http://localhost/api/contact", {
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

describe("/api/contact POST", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("CONTACT_FROM_EMAIL", "Honto <hello@honto.ai>");
    vi.stubEnv("CONTACT_TO_EMAIL", "info@honto.ai");
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
      const res = await POST(
        makeRequest({ name: "Ada", email: "ada@example.com" })
      );
      expect(res.status).toBe(500);
      expect((await jsonBody(res)).error).toMatch(/not configured/i);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 500 when CONTACT_FROM_EMAIL is missing", async () => {
      vi.stubEnv("CONTACT_FROM_EMAIL", "");
      const res = await POST(
        makeRequest({ name: "Ada", email: "ada@example.com" })
      );
      expect(res.status).toBe(500);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 500 when CONTACT_TO_EMAIL is missing", async () => {
      vi.stubEnv("CONTACT_TO_EMAIL", "");
      const res = await POST(
        makeRequest({ name: "Ada", email: "ada@example.com" })
      );
      expect(res.status).toBe(500);
      expect(sendMock).not.toHaveBeenCalled();
    });
  });

  describe("request validation", () => {
    it("returns 400 on malformed JSON", async () => {
      const res = await POST(makeRequest(null, "not-json{"));
      expect(res.status).toBe(400);
      expect((await jsonBody(res)).error).toMatch(/invalid/i);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 400 when name is missing", async () => {
      const res = await POST(makeRequest({ email: "ada@example.com" }));
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 400 when email is missing", async () => {
      const res = await POST(makeRequest({ name: "Ada" }));
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("returns 400 when email is malformed", async () => {
      const res = await POST(
        makeRequest({ name: "Ada", email: "not-an-email" })
      );
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("treats whitespace-only name as missing", async () => {
      const res = await POST(
        makeRequest({ name: "   ", email: "ada@example.com" })
      );
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("rejects names longer than 120 chars", async () => {
      const res = await POST(
        makeRequest({
          name: "a".repeat(121),
          email: "ada@example.com",
        })
      );
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it("rejects emails longer than 254 chars", async () => {
      const longLocal = "a".repeat(250);
      const res = await POST(
        makeRequest({
          name: "Ada",
          email: `${longLocal}@x.co`,
        })
      );
      expect(res.status).toBe(400);
      expect(sendMock).not.toHaveBeenCalled();
    });
  });

  describe("happy paths", () => {
    it("sends with minimal valid payload (name + email)", async () => {
      const res = await POST(
        makeRequest({ name: "Ada Lovelace", email: "ada@example.com" })
      );

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
      };
      expect(args.from).toBe("Honto <hello@honto.ai>");
      expect(args.to).toEqual(["info@honto.ai"]);
      expect(args.replyTo).toBe("ada@example.com");
      expect(args.subject).toBe("New lead from Ada Lovelace");
      expect(args.text).toContain("Name: Ada Lovelace");
      expect(args.text).toContain("Email: ada@example.com");
      expect(args.text).toContain("(no message provided)");
    });

    it("includes company in subject line when provided", async () => {
      await POST(
        makeRequest({
          name: "Ada",
          email: "ada@example.com",
          company: "Analytical Engine",
        })
      );
      const args = sendMock.mock.calls[0][0] as { subject: string };
      expect(args.subject).toBe("New lead from Ada (Analytical Engine)");
    });

    it("includes phone in text and html when provided", async () => {
      await POST(
        makeRequest({
          name: "Ada",
          email: "ada@example.com",
          phone: "15551234567",
        })
      );
      const args = sendMock.mock.calls[0][0] as { text: string; html: string };
      expect(args.text).toContain("Phone: 15551234567");
      expect(args.html).toContain("15551234567");
    });

    it("includes the message body when provided", async () => {
      await POST(
        makeRequest({
          name: "Ada",
          email: "ada@example.com",
          message: "Need help shipping.",
        })
      );
      const args = sendMock.mock.calls[0][0] as { text: string; html: string };
      expect(args.text).toContain("Need help shipping.");
      expect(args.text).not.toContain("(no message provided)");
      expect(args.html).toContain("Need help shipping.");
    });

    it('falls back to "(no message provided)" when message omitted', async () => {
      await POST(makeRequest({ name: "Ada", email: "ada@example.com" }));
      const args = sendMock.mock.calls[0][0] as { text: string; html: string };
      expect(args.text).toContain("(no message provided)");
      expect(args.html).toContain("No message provided");
    });
  });

  describe("security", () => {
    it("escapes HTML in user-provided fields", async () => {
      await POST(
        makeRequest({
          name: '<script>alert("xss")</script>',
          email: "ada@example.com",
          message: "<img src=x onerror=1>",
        })
      );
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

      const res = await POST(
        makeRequest({ name: "Ada", email: "ada@example.com" })
      );
      expect(res.status).toBe(502);
      expect((await jsonBody(res)).error).toMatch(/could not send/i);
      expect(errorSpy).toHaveBeenCalledWith(
        "[/api/contact] Resend error:",
        expect.objectContaining({ statusCode: 403 })
      );

      errorSpy.mockRestore();
    });
  });

  describe("phone validation", () => {
    it.each([
      ["+1 555 123 4567", "contains plus and spaces"],
      ["555-123-4567", "contains dashes"],
      ["(555) 123-4567", "contains parens"],
      ["abc1234567", "contains letters"],
      ["123456", "too short (6 digits)"],
      ["1234567890123456", "too long (16 digits)"],
    ])("rejects phone %s (%s)", async (phone) => {
      const res = await POST(
        makeRequest({
          name: "Ada",
          email: "ada@example.com",
          phone,
        })
      );
      expect(res.status).toBe(400);
      expect((await jsonBody(res)).error).toMatch(/digits/i);
      expect(sendMock).not.toHaveBeenCalled();
    });

    it.each([
      ["1234567", "7 digits (min)"],
      ["15551234567", "11 digits"],
      ["123456789012345", "15 digits (max)"],
    ])("accepts phone %s (%s)", async (phone) => {
      const res = await POST(
        makeRequest({
          name: "Ada",
          email: "ada@example.com",
          phone,
        })
      );
      expect(res.status).toBe(200);
      expect(sendMock).toHaveBeenCalledTimes(1);
    });

    it("still accepts payload with no phone", async () => {
      const res = await POST(
        makeRequest({ name: "Ada", email: "ada@example.com" })
      );
      expect(res.status).toBe(200);
    });
  });

  describe("rate limiting", () => {
    it("allows first two requests from the same IP and blocks the third", async () => {
      const ip = "198.51.100.7";
      const payload = { name: "Ada", email: "ada@example.com" };

      const r1 = await POST(makeRequest(payload, undefined, ip));
      const r2 = await POST(makeRequest(payload, undefined, ip));
      const r3 = await POST(makeRequest(payload, undefined, ip));

      expect(r1.status).toBe(200);
      expect(r2.status).toBe(200);
      expect(r3.status).toBe(429);
      expect(r3.headers.get("Retry-After")).toMatch(/^\d+$/);
      expect((await jsonBody(r3)).error).toMatch(/too many/i);
      expect(sendMock).toHaveBeenCalledTimes(2);
    });

    it("tracks distinct IPs independently", async () => {
      const payload = { name: "Ada", email: "ada@example.com" };

      await POST(makeRequest(payload, undefined, "198.51.100.10"));
      await POST(makeRequest(payload, undefined, "198.51.100.10"));
      const blocked = await POST(
        makeRequest(payload, undefined, "198.51.100.10")
      );
      const otherIp = await POST(
        makeRequest(payload, undefined, "198.51.100.11")
      );

      expect(blocked.status).toBe(429);
      expect(otherIp.status).toBe(200);
    });

    it("resets the window after an hour", async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-04-23T12:00:00Z"));

      const ip = "198.51.100.20";
      const payload = { name: "Ada", email: "ada@example.com" };

      await POST(makeRequest(payload, undefined, ip));
      await POST(makeRequest(payload, undefined, ip));
      const blocked = await POST(makeRequest(payload, undefined, ip));
      expect(blocked.status).toBe(429);

      vi.advanceTimersByTime(60 * 60 * 1000 + 1000);
      const afterWindow = await POST(makeRequest(payload, undefined, ip));
      expect(afterWindow.status).toBe(200);

      vi.useRealTimers();
    });

    it("counts rate limit before validation so spam attempts are budgeted", async () => {
      const ip = "198.51.100.30";

      await POST(makeRequest({}, undefined, ip));
      await POST(makeRequest({}, undefined, ip));
      const third = await POST(makeRequest({}, undefined, ip));

      expect(third.status).toBe(429);
    });
  });
});
