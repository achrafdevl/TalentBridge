import Navbar from "./components/layout/Navbar";
import Hero from "./components/features/landing/Hero";
import FeaturesSection from "./components/features/landing/Features";
import HowItWorks from "./components/features/landing/HowItWorks";
import BenefitsSection from "./components/features/landing/BenefitsSection";
import CTASection from "./components/features/landing/CTASection";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </>
  );
}
