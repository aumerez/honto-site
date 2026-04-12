"use client";

import { useLocale } from "@/context/LocaleContext";

export default function Footer() {
  const { locale, t } = useLocale();
  const f = t.footer;

  const footerLinks = {
    [f.platformHeading]: [
      { label: f.platformOverview, href: `/${locale}/platform` },
      { label: f.hontoOps, href: `/${locale}/opsai` },
      { label: f.hontoWholograph, href: `/${locale}/platform#wholo-heading` },
      { label: f.hontoInfra, href: `/${locale}/platform#infra-heading` },
    ],
    [f.servicesHeading]: [
      { label: f.aiConsulting, href: `/${locale}/#services` },
      { label: f.aiAgents, href: `/${locale}/#services` },
      { label: f.aiSkills, href: `/${locale}/#services` },
      { label: f.aiInfrastructure, href: `/${locale}/#services` },
      { label: f.ragSystems, href: `/${locale}/#services` },
    ],
    [f.companyHeading]: [
      { label: f.about, href: "#" },
      { label: f.careers, href: "#" },
      { label: f.contact, href: `/${locale}/#contact` },
    ],
    [f.resourcesHeading]: [
      { label: f.caseStudies, href: `/${locale}/case-studies` },
      { label: f.documentation, href: "#" },
      { label: f.blog, href: "#" },
    ],
  };

  return (
    <footer
      className="border-t border-border bg-bg-elevated"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a
              href={`/${locale}`}
              className="font-heading text-xl font-bold tracking-tight text-text-primary"
            >
              honto<span className="text-accent">.</span>
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
              {f.brandDescription}
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-text-muted">
                {title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {f.copyright}
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              {f.privacy}
            </a>
            <a
              href="#"
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              {f.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
