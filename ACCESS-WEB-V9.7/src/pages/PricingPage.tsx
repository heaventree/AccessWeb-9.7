import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { NewPricingPlans } from '../components/subscription/NewPricingPlans';

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto pt-[130px] px-4 sm:px-6 lg:px-8 pb-24">
      <div className="text-center mb-16">
        <Badge variant="outline" className="bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4] border-0 rounded-full px-4 py-1 mb-6">
          Choose a package
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          No hidden fees or complicated tiers. Choose the plan that's right for your business.
        </p>
      </div>
      
      <div className="mt-8">
        <NewPricingPlans />
      </div>
      
      <div className="mt-24 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Check className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
              Can I change plans later?
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 ml-7">
              Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately,
              and downgrades take effect at the end of your current billing cycle.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Check className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
              How do I cancel my subscription?
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 ml-7">
              You can cancel your subscription from your account settings. You'll continue to have access 
              until the end of your current billing period.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Check className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
              Do you offer a free trial?
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 ml-7">
              We offer a 14-day free trial for all plans. No credit card required to start your trial.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Check className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
              What payment methods do you accept?
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 ml-7">
              We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Check className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
              Is there a discount for non-profits?
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 ml-7">
              Yes, we offer special pricing for non-profit organizations. Please contact our support team
              for more information.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Check className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
              Can I use the tool on multiple websites?
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300 ml-7">
              The number of websites you can scan depends on your plan. Starter plan includes 1 website,
              while Professional and Enterprise plans include multiple websites.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-16 bg-[#e0f5f1] dark:bg-[#0fae96]/20 rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ready to make your website accessible?</h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Start your 14-day free trial today. No credit card required.
        </p>
        <div className="mt-8 flex justify-center">
          <Link to={isAuthenticated ? "/dashboard" : "/signup"}>
            <Button 
              className="bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 transition-all duration-300 rounded-full px-8 py-6 text-white text-lg"
            >
              {isAuthenticated ? "Go to Dashboard" : "Start Free Trial"} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}