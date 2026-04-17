"use client";

import { useEffect, useState } from "react";

export default function Navigation() {
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
      aria-label="Main navigation"
    >
      <a href="#top" className="logo">
        honto<em>.</em>
      </a>
      <div className="nav-links">
        <a href="#problems">Problems</a>
        <a href="#process">Method</a>
        <a href="#capabilities">Capabilities</a>
        <a href="#opsai">OpsAI</a>
        <a href="#principles">Principles</a>
      </div>
      <div className="nav-cta">
        <span className="pill">
          <span className="dot" />
          Booking Q3 · 2026
        </span>
        <a href="#contact" className="pill solid">
          Contact →
        </a>
      </div>
    </nav>
  );
}
