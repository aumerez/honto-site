import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Services from "../components/Services";
import CoreProduct from "../components/CoreProduct";
import HowItWorks from "../components/HowItWorks";
import WhyUs from "../components/WhyUs";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Services />
        <CoreProduct />
        <HowItWorks />
        <WhyUs />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
}
