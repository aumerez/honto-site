import Link from "next/link";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg" role="contentinfo">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="font-mono text-sm font-medium tracking-wider uppercase text-text-primary"
            >
              Honto<span className="text-accent">.</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-muted">
              Engineering consultancy for AI systems.
            </p>
          </div>

          {/* Nav Links */}
          <div className="flex flex-wrap gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-xs uppercase tracking-wider text-text-muted transition-colors hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Honto. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs text-text-muted transition-colors hover:text-text-secondary"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
