import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Services from "./components/Services";
import CompressedAbout from "./components/CompressedAbout";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Services />
        <CompressedAbout />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
