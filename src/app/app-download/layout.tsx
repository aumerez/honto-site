import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Outfit } from "next/font/google";
import "../globals.css";

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

export const metadata: Metadata = {
  title: "honto.ops — Desktop install",
  // Hidden route: never indexable.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06060a",
};

export default function AppDownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${outfit.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-bg text-text-primary antialiased"
      >
        {children}
      </body>
    </html>
  );
}
