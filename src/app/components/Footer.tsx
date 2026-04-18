"use client";

import { useLocale } from "@/context/LocaleContext";

type FooterCopy = {
  copyright: string;
  location: string;
  languages: string;
};

export default function Footer() {
  const { t } = useLocale();
  const copy = (t.landing as { footer: FooterCopy }).footer;

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container-x foot">
        <div>{copy.copyright}</div>
        <div>{copy.location}</div>
        <div>{copy.languages}</div>
      </div>
    </footer>
  );
}
