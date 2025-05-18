import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/strapi/navigation/Navigation';

interface StrapiLayoutProps {
  children?: React.ReactNode;
}

/**
 * Layout component that integrates Strapi navigation with the application
 */
const StrapiLayout: React.FC<StrapiLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <img 
              src="/logo.svg" 
              alt="AccessWeb" 
              className="h-8 w-auto" 
            />
            <span className="text-xl font-bold text-gray-900 dark:text-white">AccessWeb</span>
          </a>
          
          <Navigation className="ml-auto" />
          
          <div className="flex items-center space-x-4 ml-4">
            {/* Dark mode toggle */}
            <button
              type="button"
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
              aria-label="Toggle dark mode"
              onClick={() => document.documentElement.classList.toggle('dark')}
            >
              <svg className="hidden dark:block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg className="block dark:hidden h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>

            {/* Account/Login button */}
            <a
              href="/my-account"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-[#0fae96] hover:bg-[#0c9a85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] transition-colors"
            >
              My Account
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow bg-gray-50 dark:bg-slate-900">
        {children || <Outlet />}
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AccessWeb</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Creating inclusive digital experiences through intelligent compliance tools.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tools</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/tools/colour-palette" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">WCAG Colour Palette</a>
                </li>
                <li>
                  <a href="/tools/image-alt-scanner" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Image Alt Scanner</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">About Us</a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Contact</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} AccessWeb. All rights reserved.
            </p>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="https://twitter.com" className="text-gray-500 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]" aria-label="Twitter">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://linkedin.com" className="text-gray-500 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]" aria-label="LinkedIn">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="https://facebook.com" className="text-gray-500 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]" aria-label="Facebook">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10s-10 4.477-10 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54v-2.891h2.54v-2.203c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.891h-2.33v6.988c4.781-.75 8.437-4.887 8.437-9.878z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StrapiLayout;