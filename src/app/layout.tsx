import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const outfit = Outfit({
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
  title: "Honto — AI Systems Engineering",
  description:
    "Production-grade AI infrastructure that captures, scales, and operationalizes expert knowledge across your organization.",
  keywords: [
    "AI consulting",
    "AI agents",
    "RAG systems",
    "AI infrastructure",
    "expert knowledge systems",
    "AI strategy",
  ],
  openGraph: {
    title: "Honto — AI Systems Engineering",
    description:
      "We build production-grade AI systems that think like your best engineers.",
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
  themeColor: "#06060a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${outfit.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-text-primary antialiased">{children}</body>
    </html>
  );
}
