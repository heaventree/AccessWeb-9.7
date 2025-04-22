import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggleFixed from '../ui/theme-toggle-fixed';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-[#0fae96]">
        Skip to main content
      </a>

      {/* Navigation */}
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <span className="text-xl font-bold text-[#0fae96] dark:text-[#5eead4]">AccessWebPro</span>
              </Link>

              {/* Main Navigation - Desktop */}
              <nav className="hidden md:flex items-center space-x-4">
                <Link to="/checker" className={`px-3 py-2 ${isActive('/checker') 
                  ? 'text-[#0fae96] dark:text-[#5eead4]' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4]'} transition-colors`}>
                  WCAG Checker
                </Link>
                <Link to="/resources" className={`px-3 py-2 ${isActive('/resources') 
                  ? 'text-[#0fae96] dark:text-[#5eead4]' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4]'} transition-colors`}>
                  Resources
                </Link>
                <Link to="/pricing" className={`px-3 py-2 ${isActive('/pricing') 
                  ? 'text-[#0fae96] dark:text-[#5eead4]' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4]'} transition-colors`}>
                  Pricing
                </Link>
                <Link to="/about" className={`px-3 py-2 ${isActive('/about') 
                  ? 'text-[#0fae96] dark:text-[#5eead4]' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4]'} transition-colors`}>
                  About
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Auth Links - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/login" className={`px-3 py-2 ${isActive('/login') 
                  ? 'text-[#0fae96] dark:text-[#5eead4]' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4]'} transition-colors`}>
                  Log in
                </Link>
                <Link to="/signup" className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Sign up
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={toggleMenu}
                className="inline-flex md:hidden items-center justify-center rounded-md p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0fae96]"
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}
          aria-hidden={!isMenuOpen}
        >
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              to="/checker"
              className={`block px-3 py-2 rounded-md ${
                isActive('/checker')
                  ? 'bg-gray-100 dark:bg-slate-700 text-[#0fae96] dark:text-[#5eead4]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#0fae96] dark:hover:text-[#5eead4]'
              }`}
              onClick={closeMenu}
            >
              WCAG Checker
            </Link>
            <Link
              to="/resources"
              className={`block px-3 py-2 rounded-md ${
                isActive('/resources')
                  ? 'bg-gray-100 dark:bg-slate-700 text-[#0fae96] dark:text-[#5eead4]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#0fae96] dark:hover:text-[#5eead4]'
              }`}
              onClick={closeMenu}
            >
              Resources
            </Link>
            <Link
              to="/pricing"
              className={`block px-3 py-2 rounded-md ${
                isActive('/pricing')
                  ? 'bg-gray-100 dark:bg-slate-700 text-[#0fae96] dark:text-[#5eead4]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#0fae96] dark:hover:text-[#5eead4]'
              }`}
              onClick={closeMenu}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md ${
                isActive('/about')
                  ? 'bg-gray-100 dark:bg-slate-700 text-[#0fae96] dark:text-[#5eead4]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#0fae96] dark:hover:text-[#5eead4]'
              }`}
              onClick={closeMenu}
            >
              About
            </Link>
            <div className="border-t border-gray-200 dark:border-slate-700 my-2 pt-2">
              <Link
                to="/login"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/login')
                    ? 'bg-gray-100 dark:bg-slate-700 text-[#0fae96] dark:text-[#5eead4]'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-[#0fae96] dark:hover:text-[#5eead4]'
                }`}
                onClick={closeMenu}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 mt-2 text-center bg-[#0066FF] hover:bg-[#0066FF]/90 text-white rounded-full"
                onClick={closeMenu}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}

      {/* Fixed theme toggle */}
      <ThemeToggleFixed />
    </div>
  );
}