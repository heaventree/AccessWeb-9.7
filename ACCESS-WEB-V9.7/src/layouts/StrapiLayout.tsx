import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Navigation } from '@/components/Navigation';
import { CheckCircle } from 'lucide-react';

interface StrapiLayoutProps {
  children?: React.ReactNode;
}

/**
 * Layout component that integrates navigation with the original application layout
 */
const StrapiLayout: React.FC<StrapiLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Modern header with unified navigation component */}
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <Navigation />
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
                  <Link to="/tools/colour-palette" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">WCAG Colour Palette</Link>
                </li>
                <li>
                  <Link to="/tools/image-alt-scanner" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Image Alt Scanner</Link>
                </li>
                <li>
                  <Link to="/checker" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">WCAG Checker</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Contact</Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} AccessWeb. All rights reserved.
            </p>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="https://twitter.com" className="text-gray-500 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://linkedin.com" className="text-gray-500 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="https://facebook.com" className="text-gray-500 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
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