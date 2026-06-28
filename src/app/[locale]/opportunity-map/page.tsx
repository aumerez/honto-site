"use client";

import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import OpportunityMapPage from "../../components/OpportunityMap/OpportunityMapPage";

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
