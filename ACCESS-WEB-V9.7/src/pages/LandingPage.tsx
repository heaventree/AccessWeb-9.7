import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/landing/navbar";
import HeroSection from "../components/landing/hero-section";
import StatSection from "../components/landing/stat-section";
import FeatureSection from "../components/landing/feature-section";
import HowItWorks from "../components/landing/how-it-works";
import CTABanner from "../components/landing/cta-banner";
import TestimonialSection from "../components/landing/testimonial-section";
import NewsletterSection from "../components/landing/newsletter-section";
import Footer from "../components/landing/footer";
import AccessibilityBadge from "../components/landing/accessibility-badge";

export function LandingPage() {
  const navigate = useNavigate();
  const [isTrialSubmitting, setIsTrialSubmitting] = useState(false);
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  
  // Function to handle free trial signup
  const handleTrialSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsTrialSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsTrialSubmitting(false);
      navigate('/signup');
    }, 800);
  };

  // Function to handle newsletter signup
  const handleNewsletterSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsNewsletterSubmitting(false);
      // Show success notification (could use toast here)
      alert('Thank you for subscribing to our newsletter!');
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
        <NewsletterSection onNewsletterSignup={handleNewsletterSignup} isSubmitting={isNewsletterSubmitting} />
      </main>
      <Footer />
      <AccessibilityBadge />
    </div>
  );
}