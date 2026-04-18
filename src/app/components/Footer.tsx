"use client";

import LocaleSwitch from "./LocaleSwitch";
import { useLocale } from "@/context/LocaleContext";

export default function Footer() {
  const { t } = useLocale();
  const f = t.footer;

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container-x foot">
        <div>{f.copyright}</div>
        <div>{f.location}</div>
        <div>
          <LocaleSwitch />
        </div>
      </div>
    </footer>
  );
}
