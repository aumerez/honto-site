import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import SelectedWork from "./components/SelectedWork";
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
        <SelectedWork />
        <Services />
        <CompressedAbout />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
