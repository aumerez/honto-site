"use client";

import { useEffect, useState } from "react";
import LocaleSwitch from "./LocaleSwitch";
import { useLocale } from "@/context/LocaleContext";

export default function Navigation() {
  const { t } = useLocale();
  const nav = t.nav;
  const [scrolled, setScrolled] = useState(false);

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
      <a href="#top" className="logo">
        honto<em>.</em>
      </a>
      <div className="nav-links">
        <a href="#problems">{nav.problems}</a>
        <a href="#process">{nav.method}</a>
        <a href="#capabilities">{nav.capabilities}</a>
        <a href="#honto-ops">{nav.hontoOps}</a>
        <a href="#principles">{nav.principles}</a>
      </div>
      <div className="nav-cta">
        <LocaleSwitch />
        <a href="#contact" className="pill solid">
          {nav.contact} →
        </a>
      </div>
    </nav>
  );
}
