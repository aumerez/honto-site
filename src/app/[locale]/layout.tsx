import type { Metadata, Viewport } from "next";
import {
  Instrument_Serif,
  JetBrains_Mono,
  Inter,
  Manrope,
} from "next/font/google";
import { notFound } from "next/navigation";
import { isValidLocale } from "@/lib/locales";
import type { Locale } from "@/lib/locales";
import { getDictionary } from "@/lib/i18n";
import { LocaleProvider } from "@/context/LocaleContext";
import { organizationSchema } from "@/lib/structuredData";
import "../globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-brand",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const m = dict.metadata as {
    homeTitle: string;
    homeDescription: string;
    homeOgTitle: string;
    homeOgDescription: string;
  };

  return {
    title: m.homeTitle,
    description: m.homeDescription,
    keywords: [
      "AI systems engineering",
      "AI consulting",
      "autonomous agents",
      "RAG systems",
      "AI infrastructure",
      "domain skills",
      "AI evals",
    ],
    openGraph: {
      title: m.homeOgTitle,
      description: m.homeOgDescription,
      type: "website",
      locale: locale === "es" ? "es_ES" : "en_US",
    },
    alternates: {
      languages: {
        en: "/en",
        es: "/es",
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e0d0b",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale);

  const orgSchema = organizationSchema(locale);

  return (
    <html
      lang={locale}
      className={`${instrumentSerif.variable} ${jetbrainsMono.variable} ${inter.variable} ${manrope.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <LocaleProvider locale={locale} dictionary={dictionary}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
