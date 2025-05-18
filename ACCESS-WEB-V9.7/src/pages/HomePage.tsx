import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Homepage component
 */
const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-slate-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Create Inclusive Digital Experiences
              </h1>
              <p className="text-xl mb-8 text-gray-300">
                Our intelligent accessibility compliance tools help you build web applications that everyone can use.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/tools/colour-palette"
                  className="px-6 py-3 bg-[#0fae96] hover:bg-[#0c9a85] text-white font-medium rounded-full transition-colors"
                >
                  Try Our Tools
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3 border border-white hover:bg-white hover:text-gray-900 text-white font-medium rounded-full transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="/images/hero-illustration.svg"
                alt="Web Accessibility Illustration"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Accessibility Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700">
              <div className="w-14 h-14 bg-[#0fae96] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#0fae96]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                WCAG Colour Palette
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Ensure your color combinations meet WCAG 2.1 contrast requirements for text readability.
              </p>
              <Link
                to="/tools/colour-palette"
                className="text-[#0fae96] hover:text-[#0c9a85] dark:text-[#5eead4] dark:hover:text-[#4fd0bd] font-medium inline-flex items-center"
              >
                Try Tool
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700">
              <div className="w-14 h-14 bg-[#0fae96] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#0fae96]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Image Alt Scanner
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Identify images missing alternative text and get AI-powered suggestions for better accessibility.
              </p>
              <Link
                to="/tools/image-alt-scanner"
                className="text-[#0fae96] hover:text-[#0c9a85] dark:text-[#5eead4] dark:hover:text-[#4fd0bd] font-medium inline-flex items-center"
              >
                Try Tool
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-slate-700">
              <div className="w-14 h-14 bg-[#0fae96] bg-opacity-10 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-[#0fae96]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Accessibility Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Generate comprehensive reports on your website's accessibility compliance with detailed recommendations.
              </p>
              <Link
                to="/my-account"
                className="text-[#0fae96] hover:text-[#0c9a85] dark:text-[#5eead4] dark:hover:text-[#4fd0bd] font-medium inline-flex items-center"
              >
                Sign Up
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-[#0fae96] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to make your website accessible to everyone?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of developers and designers who are creating inclusive digital experiences with our tools.
          </p>
          <Link
            to="/my-account"
            className="inline-flex items-center px-6 py-3 border border-white bg-white text-[#0fae96] hover:bg-transparent hover:text-white font-medium rounded-full transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;