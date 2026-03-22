import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Honto",
  description:
    "Engineering consultancy for AI systems. We design, build, and operate AI infrastructure that works in production.",
  keywords: [
    "AI consulting",
    "AI engineering",
    "AI infrastructure",
    "AI systems",
  ],
  openGraph: {
    title: "Honto",
    description: "Engineering consultancy for AI systems.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0c0b09",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-text-primary antialiased">{children}</body>
    </html>
  );
}
