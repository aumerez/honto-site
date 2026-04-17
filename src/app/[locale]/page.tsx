import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Problems from "../components/Problems";
import Process from "../components/Process";
import Capabilities from "../components/Capabilities";
import OpsAISection from "../components/OpsAISection";
import Principles from "../components/Principles";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Marquee />
        <Problems />
        <Process />
        <Capabilities />
        <OpsAISection />
        <Principles />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
