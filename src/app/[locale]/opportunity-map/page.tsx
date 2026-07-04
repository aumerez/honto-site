import type { Metadata } from "next";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import OpportunityMapPage from "../../components/OpportunityMap/OpportunityMapPage";
import { getDictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const om = dict.opportunityMap as { title: string; subtitle: string };
  return {
    title: om.title,
    description: om.subtitle,
    robots: { index: true, follow: true },
  };
}

export default function OpportunityMap() {
  return (
    <>
      <Navigation />
      <main>
        <OpportunityMapPage />
      </main>
      <Footer />
    </>
  );
}
