"use client";

import { useLocale } from "@/context/LocaleContext";

type FooterCopy = {
  copyright: string;
  location: string;
  languages: string;
  linkedin: string;
};

const LINKEDIN_URL = "https://www.linkedin.com/company/honto-ai";

export default function Footer() {
  const { t } = useLocale();
  const copy = (t.landing as { footer: FooterCopy }).footer;

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container-x foot">
        <div>{copy.copyright}</div>
        <div>{copy.location}</div>
        <div className="foot-links">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="honto on LinkedIn"
          >
            {copy.linkedin}
          </a>
          <span aria-hidden="true">·</span>
          <span>{copy.languages}</span>
        </div>
      </div>
    </footer>
  );
}
