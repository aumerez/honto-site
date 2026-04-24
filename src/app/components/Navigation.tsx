"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/context/LocaleContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";

type NavCopy = {
  ariaLabel: string;
  problems: string;
  method: string;
  capabilities: string;
  hontoOps: string;
  principles: string;
  contact: string;
};

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLocale();
  const nav = (t.landing as { nav: NavCopy }).nav;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`nav${scrolled ? " scrolled" : ""}`}
      role="navigation"
      aria-label={nav.ariaLabel}
    >
      <a href="#top" className="logo" aria-label="honto.">
        <Logo size={24} label="honto." />
      </a>
      <div className="nav-links">
        <a href="#problems">{nav.problems}</a>
        <a href="#process">{nav.method}</a>
        <a href="#capabilities">{nav.capabilities}</a>
        <a href="#honto-ops">{nav.hontoOps}</a>
        <a href="#principles">{nav.principles}</a>
      </div>
      <div className="nav-cta">
        <LanguageSwitcher />
        <a href="#contact" className="pill solid">
          {nav.contact}
        </a>
      </div>
    </nav>
  );
}
