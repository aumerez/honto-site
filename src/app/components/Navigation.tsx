"use client";

import { useState, useEffect } from "react";
import { useLocale } from "@/context/LocaleContext";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navigation() {
  const { locale, t } = useLocale();
  const nav = t.nav;

  const navLinks = [
    { label: nav.services, href: `/${locale}/#services` },
    { label: nav.product, href: `/${locale}/#product` },
    { label: nav.howItWorks, href: `/${locale}/#how-it-works` },
    { label: nav.whyHonto, href: `/${locale}/#why-us` },
    { label: nav.caseStudies, href: `/${locale}/case-studies` },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <a
            href={`/${locale}`}
            className="font-heading text-xl font-bold tracking-tight text-text-primary md:text-2xl"
            aria-label="Honto — Home"
          >
            honto
            <span className="text-accent">.</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm font-medium text-text-secondary transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            ))}
            <LanguageSwitcher />
            <a
              href={`/${locale}/#contact`}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-bg transition-all hover:shadow-[0_0_24px_var(--color-accent-glow)] hover:brightness-110"
            >
              {nav.bookDemo}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-secondary transition-colors hover:text-text-primary md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? nav.closeMenu : nav.openMenu}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="8" x2="21" y2="8" />
                  <line x1="3" y1="16" x2="21" y2="16" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 top-16 z-40 bg-bg/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex flex-col gap-2 px-5 pt-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-3 font-body text-lg font-medium text-text-secondary transition-colors hover:bg-surface hover:text-accent"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="px-4 py-3">
            <LanguageSwitcher />
          </div>
          <a
            href={`/${locale}/#contact`}
            className="mt-4 rounded-full bg-accent px-6 py-3 text-center text-base font-semibold text-bg transition-all hover:brightness-110"
            onClick={() => setMobileOpen(false)}
          >
            {nav.bookDemo}
          </a>
        </div>
      </div>
    </nav>
  );
}
