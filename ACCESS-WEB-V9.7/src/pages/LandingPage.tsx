import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/landing/hero-section';
import StatSection from '../components/landing/stat-section';
import FeatureSection from '../components/landing/feature-section';
import CTABanner from '../components/landing/cta-banner';
import TestimonialSection from '../components/landing/testimonial-section';
import PricingSection from '../components/landing/pricing-section';
import FAQSection from '../components/landing/faq-section';
import AccessibilityBadge from '../components/landing/accessibility-badge';

export function LandingPage() {
  const navigate = useNavigate();
  const [isTrialSubmitting, setIsTrialSubmitting] = useState(false);
  
  // Function to handle free trial signup
  const handleTrialSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsTrialSubmitting(true);
    
    try {
      // Here we would normally make an API call
      // await apiRequest("POST", "/api/trial-signup", { email: (e.target as HTMLFormElement).email.value });
      
      // Instead, we'll just navigate to the signup page
      navigate('/signup');
    } catch (error) {
      console.error("Trial signup error:", error);
    } finally {
      setIsTrialSubmitting(false);
    }
  };

  // Define a simple click handler that uses React Router navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="relative">
      <main id="main-content">
        <HeroSection onTrialSignup={handleTrialSignup} isSubmitting={isTrialSubmitting} />
        <StatSection />
        <FeatureSection />
        <CTABanner onTrialSignup={handleTrialSignup} isSubmitting={isTrialSubmitting} />
        <TestimonialSection />
        <PricingSection />
        <FAQSection />
      </main>
      <AccessibilityBadge />
    </div>
  );
}