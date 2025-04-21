import Navbar from "../../components/ui-preview/landing/navbar";
import HeroSection from "../../components/ui-preview/landing/hero-section";
import StatSection from "../../components/ui-preview/landing/stat-section";
import FeatureSection from "../../components/ui-preview/landing/feature-section";
import HowItWorks from "../../components/ui-preview/landing/how-it-works";
import CTABanner from "../../components/ui-preview/landing/cta-banner";
import TestimonialSection from "../../components/ui-preview/landing/testimonial-section";
import PricingSection from "../../components/ui-preview/landing/pricing-section";
import FAQSection from "../../components/ui-preview/landing/faq-section";
import NewsletterSection from "../../components/ui-preview/landing/newsletter-section";
import Footer from "../../components/ui-preview/landing/footer";
import AccessibilityBadge from "../../components/ui-preview/landing/accessibility-badge";
import { FormEvent, useState } from "react";
export default function HomePreview() {
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [isTrialSubmitting, setIsTrialSubmitting] = useState(false);

  // Function to handle free trial signup
  const handleTrialSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsTrialSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsTrialSubmitting(false);
      // Simulate success
      alert("Trial signup successful!");
    }, 800);
  };

  // Function to handle newsletter signup
  const handleNewsletterSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsNewsletterSubmitting(false);
      // Simulate success
      alert("Newsletter signup successful!");
    }, 800);
  };

  return (
    <div className="relative">
      <Navbar />
      <main id="main-content">
        <HeroSection onTrialSignup={handleTrialSignup} isSubmitting={isTrialSubmitting} />
        <StatSection />
        <FeatureSection />
        <HowItWorks />
        <CTABanner onTrialSignup={handleTrialSignup} isSubmitting={isTrialSubmitting} />
        <TestimonialSection />
        <PricingSection />
        <FAQSection />
        <NewsletterSection onNewsletterSignup={handleNewsletterSignup} isSubmitting={isNewsletterSubmitting} />
      </main>
      <Footer />
      <AccessibilityBadge />
    </div>
  );
}
