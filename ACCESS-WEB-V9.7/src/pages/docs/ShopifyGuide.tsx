import React from 'react';
import { ShoppingCart, Code, Zap, Shield, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Shopify Guide Page Component with updated styling to match the new UI Kit
 */
export const ShopifyGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[130px] pb-[80px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Shopify Integration Guide</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Learn how to integrate our accessibility testing tools with your Shopify store to create a more inclusive shopping experience.
          </p>
        </div>

        {/* Overview Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-slate-700">
          <div className="p-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <ShoppingCart className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shopify Integration Overview</h2>
            </div>
            
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                Our Shopify integration allows you to automatically scan your entire store for accessibility issues, ensuring 
                your online shop is accessible to all customers, including those with disabilities.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <Zap className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Easy Setup</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Install our app from the Shopify App Store and connect your store in minutes.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <Shield className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Compliance</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Ensure your store meets WCAG 2.1 standards and ADA compliance requirements.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Automated Fixes</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Apply one-click fixes to common accessibility issues in your theme and content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-slate-700">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <Code className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Installation Guide</h2>
            </div>
            
            <div className="text-gray-700 dark:text-gray-300 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Install the App</h3>
                <p className="mb-4">Visit the <a href="#" className="text-[#0fae96] dark:text-[#5eead4] hover:underline">Shopify App Store</a> and install our AccessWeb app to your Shopify store.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Connect Your Store</h3>
                <p className="mb-4">Follow the prompts to authorize the app and connect your store to our accessibility testing platform.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Configure Settings</h3>
                <p className="mb-4">Set up your scanning preferences and accessibility standards in the app dashboard.</p>
              </div>

              <div className="bg-[#0fae96]/5 dark:bg-[#0fae96]/10 p-4 rounded-xl border border-[#0fae96]/10 dark:border-[#0fae96]/20 mt-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#0fae96] dark:text-[#5eead4]" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Important Note</h3>
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      <p>The app requires admin permissions to scan and modify your store theme files. Make sure you have a backup of your theme before applying automatic fixes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12 bg-[#0fae96] dark:bg-[#0fae96]/80 rounded-xl shadow-sm p-8 text-center border border-[#0fae96]/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            Detailed Documentation Coming Soon
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            We're currently expanding our Shopify integration documentation with detailed guides, tutorials, and best practices.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-[#0fae96] bg-white hover:bg-gray-50 transition-colors"
          >
            Contact Support
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopifyGuide;