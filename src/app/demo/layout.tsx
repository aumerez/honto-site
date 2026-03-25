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
  title: "OpsAI — Demo",
  description:
    "Convierte la experiencia de tus ingenieros en inteligencia operacional escalable. Agenda una demo de 15 minutos.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06060a",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`dark ${spaceGrotesk.variable} ${outfit.variable}`}
    >
      <body className="bg-bg text-text-primary antialiased">{children}</body>
    </html>
  );
}
