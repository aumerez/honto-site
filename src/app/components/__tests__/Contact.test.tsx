import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Contact from "../Contact";
import { renderWithLocale } from "@/test/renderWithLocale";

describe("Contact", () => {
  it("renders the mailto link to info@honto.ai", () => {
    renderWithLocale(<Contact />);
    const link = screen.getByRole("link", { name: /start a conversation/i });
    expect(link.getAttribute("href")).toBe("mailto:info@honto.ai");
  });

  it("renders the contact metadata rows", () => {
    renderWithLocale(<Contact />);
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Response")).toBeTruthy();
    expect(screen.getByText("Routing")).toBeTruthy();
    expect(screen.getByText("NDA")).toBeTruthy();
  });
});
