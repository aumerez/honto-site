"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm Honto's AI assistant. I can answer questions about our services, how we work, or help you book a demo. What would you like to know?",
  },
];

const QUICK_ACTIONS = [
  "What services do you offer?",
  "Can I book a demo?",
  "How do you implement AI?",
];

/* Simple pattern-matched responses for the mock assistant. */
function generateResponse(input: string): string {
  const lower = input.toLowerCase();

  if (
    lower.includes("service") ||
    lower.includes("offer") ||
    lower.includes("do you do")
  ) {
    return "We offer five core services:\n\n**AI Consulting & Strategy** — Roadmaps for AI adoption with measurable ROI.\n**AI Agents** — Autonomous workflows that integrate with your systems.\n**Domain-Specific AI Skills** — Custom AI capabilities for your exact processes.\n**AI Infrastructure** — Scalable, secure deployment with DevSecOps.\n**RAG & Knowledge Systems** — AI grounded in your organization's actual data.\n\nWould you like to dive deeper into any of these?";
  }

  if (
    lower.includes("book") ||
    lower.includes("demo") ||
    lower.includes("call") ||
    lower.includes("meeting")
  ) {
    return "I'd be happy to help you book a demo! You can use the scheduling section below, or I can connect you directly with our team.\n\nJust share your **name**, **company**, and **preferred time**, and we'll get back to you within 24 hours.";
  }

  if (
    lower.includes("implement") ||
    lower.includes("how do you") ||
    lower.includes("process") ||
    lower.includes("work")
  ) {
    return "Our process has four phases:\n\n**1. Map** — We analyze your domain expertise and workflows.\n**2. Build** — We architect AI systems tailored to your needs.\n**3. Deploy** — Production-grade deployment with security built in.\n**4. Scale** — Expand across teams with continuous improvement.\n\nEvery engagement starts with a discovery session. Want to schedule one?";
  }

  if (
    lower.includes("product") ||
    lower.includes("platform") ||
    lower.includes("expert")
  ) {
    return "Our **Expert Intelligence Platform** is an AI layer that augments your engineering experts. It captures institutional knowledge, makes it reusable, and ensures every AI response is reliable, traceable, and aligned with your proven expertise.\n\nThink of it as giving every team member access to your best engineer's thinking.";
  }

  if (
    lower.includes("security") ||
    lower.includes("safe") ||
    lower.includes("compliance") ||
    lower.includes("trust")
  ) {
    return "Security is foundational, not an afterthought:\n\n- Full audit trails for every AI decision\n- DevSecOps pipelines with automated security scanning\n- Infrastructure as code with hardened configurations\n- Compliance-ready logging and traceability\n\nWe build AI systems the way critical infrastructure is built.";
  }

  if (
    lower.includes("price") ||
    lower.includes("cost") ||
    lower.includes("pricing")
  ) {
    return "Pricing depends on scope, complexity, and integration requirements. We work on both project-based and retainer models.\n\nThe best way to get accurate pricing is to **book a discovery call** where we can understand your specific needs. Shall I help set that up?";
  }

  return "That's a great question. For the most detailed answer, I'd recommend speaking with one of our AI engineers directly.\n\nWould you like to **book a demo** or learn more about our **services** or **process**?";
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      /* Simulate response delay */
      setTimeout(
        () => {
          const response = generateResponse(text);
          const assistantMsg: Message = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: response,
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsTyping(false);
        },
        800 + Math.random() * 600
      );
    },
    [isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 md:bottom-8 md:right-8 ${
          isOpen
            ? "bg-bg-card border border-border rotate-0"
            : "bg-accent hover:shadow-[0_0_32px_var(--color-accent-glow)]"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat assistant"}
        aria-expanded={isOpen}
        aria-controls="chat-panel"
      >
        {isOpen ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-primary"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-bg"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      <div
        id="chat-panel"
        role="dialog"
        aria-label="Chat assistant"
        aria-hidden={!isOpen}
        className={`fixed bottom-20 right-5 z-50 flex w-[calc(100vw-2.5rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-bg-card shadow-2xl transition-all duration-300 md:bottom-24 md:right-8 ${
          isOpen
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ height: "min(520px, 70vh)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-card bg-success" />
          </div>
          <div>
            <div className="text-sm font-semibold">Honto AI</div>
            <div className="text-xs text-text-muted">Always available</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-accent text-bg"
                      : "rounded-bl-md border border-border bg-surface text-text-primary"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: msg.content
                      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                      .replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-text-muted animate-typing" />
                    <span
                      className="h-2 w-2 rounded-full bg-text-muted animate-typing"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-text-muted animate-typing"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions (show only if no user messages yet) */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => sendMessage(action)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition-all hover:border-accent/40 hover:text-accent"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 border-t border-border px-4 py-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={isTyping}
            className="flex-1 rounded-lg bg-surface px-3 py-2.5 text-sm text-text-primary placeholder-text-muted outline-none ring-1 ring-border transition-all focus:ring-accent/50 disabled:opacity-50"
            aria-label="Type your message"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-bg transition-all hover:brightness-110 disabled:opacity-30"
            aria-label="Send message"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
