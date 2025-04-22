import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/landing/hero-section';
import StatSection from '../components/landing/stat-section';
import FeatureSection from '../components/landing/feature-section';
import CTABanner from '../components/landing/cta-banner';
import TestimonialSection from '../components/landing/testimonial-section';
import PricingSection from '../components/landing/pricing-section';
import FAQSection from '../components/landing/faq-section';
import NewsletterSection from '../components/landing/newsletter-section';
import Footer from '../components/landing/footer';
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

  // State for newsletter signup
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  
  // Function to handle newsletter signup
  const handleNewsletterSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    
    try {
      // Here we would normally make an API call
      // await apiRequest("POST", "/api/newsletter-signup", { email: (e.target as HTMLFormElement).email.value });
      
      console.log("Newsletter signup submitted");
      // Show some visual feedback (would be better with a toast notification)
      alert("Thank you for subscribing to our newsletter!");
    } catch (error) {
      console.error("Newsletter signup error:", error);
    } finally {
      setIsNewsletterSubmitting(false);
    }
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
        <NewsletterSection onNewsletterSignup={handleNewsletterSignup} isSubmitting={isNewsletterSubmitting} />
      </main>
      <Footer />
      <AccessibilityBadge />
    </div>
  );
}