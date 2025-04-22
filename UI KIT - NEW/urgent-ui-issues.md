# URGENT: Home Page and Navigation Implementation Guide

This document provides specific, detailed instructions for implementing ONLY the Home Page and Navigation Menu components of the AccessWebPro UI skin. These instructions are designed to be followed step-by-step without confusion.

## Project Structure Reference

For clarity, here are the key file paths in the AccessWebPro project structure:

```
/
├── client/
│   ├── src/
│   │   ├── App.tsx                       <- Main application component
│   │   ├── main.tsx                      <- Entry point for React app
│   │   ├── index.css                     <- Global CSS file
│   │   ├── components/
│   │   │   ├── ui/                       <- UI components
│   │   │   │   └── theme-toggle-fixed.tsx  <- Theme toggle component
│   │   │   └── shell/
│   │   │       └── AppShell.tsx          <- Layout wrapper component
│   │   └── pages/
│   │       ├── index.tsx                 <- Home page component
│   │       └── checker.tsx               <- WCAG Checker page
├── server/
│   ├── index.ts                          <- Server entry point
│   └── routes.ts                         <- API routes
└── shared/
    └── schema.ts                         <- Shared data schema
```

## Table of Contents
1. [Home Page Implementation](#1-home-page-implementation)
2. [Navigation Menu Implementation](#2-navigation-menu-implementation)
3. [Troubleshooting Common Issues](#3-troubleshooting-common-issues)

---

## 1. Home Page Implementation

### Step 1: Create or Locate the Home Page File

First, locate your home page file. It should be at:
```
client/src/pages/index.tsx
```

If it doesn't exist, create it with:
```bash
mkdir -p client/src/pages
touch client/src/pages/index.tsx
```

### Step 2: Replace ENTIRE Home Page Content

**CRITICAL**: Replace the ENTIRE content of the file with the following code. Do not try to modify the existing code - replace it completely.

```tsx
import React from 'react';
import { Link } from 'wouter';

export default function HomePage() {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Transform WCAG Guidelines Into 
              <span className="text-[#0fae96] dark:text-[#5eead4]"> Accessible Experiences</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Comprehensive tools and resources to help you build accessible websites
              that comply with modern standards and reach all your users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checker">
                <a className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-8 py-3 rounded-full text-lg font-medium inline-flex items-center justify-center">
                  Start Checking
                  <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Link>
              <Link href="/resources">
                <a className="bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 px-8 py-3 rounded-full text-lg font-medium inline-flex items-center justify-center">
                  Browse Resources
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Powerful Accessibility Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
                <svg className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">WCAG Compliance Checker</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Test your website against WCAG 2.1 and 2.2 standards with our comprehensive checker.
                Get detailed reports and actionable recommendations.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
                <svg className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Contrast Analyzer</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Ensure your color combinations meet accessibility standards with
                our advanced contrast analyzer and color suggestion tool.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
                <svg className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Accessibility Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your accessibility improvements over time with comprehensive
                analytics and progress reports for your projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
              Trusted by Industry Leaders
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">500+</p>
                <p className="text-gray-600 dark:text-gray-400">Organizations</p>
              </div>

              <div>
                <p className="text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">10k+</p>
                <p className="text-gray-600 dark:text-gray-400">Websites Checked</p>
              </div>

              <div>
                <p className="text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">98%</p>
                <p className="text-gray-600 dark:text-gray-400">Accuracy Rate</p>
              </div>

              <div>
                <p className="text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">24/7</p>
                <p className="text-gray-600 dark:text-gray-400">Expert Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0fae96]/5 dark:bg-[#0fae96]/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to make your website accessible to everyone?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of organizations that trust AccessWebPro to ensure their
              digital presence is accessible to all users.
            </p>
            <div className="flex justify-center">
              <Link href="/signup">
                <a className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-8 py-3 rounded-full text-lg font-medium">
                  Get Started Free
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

### Step 3: Ensure Your App Component Renders the Home Page

In your `App.tsx` file (usually at `client/src/App.tsx`), make sure your home page is correctly routed:

```tsx
import React from 'react';
import { Route, Switch } from 'wouter';
import HomePage from './pages/index';
// Other imports...

function App() {
  return (
    <div>
      <Switch>
        <Route path="/" component={HomePage} /> {/* This line is important */}
        {/* Other routes... */}
      </Switch>
    </div>
  );
}

export default App;
```

### Step 4: Add Required CSS Classes to Global CSS

Make sure your global CSS file includes base styles (typically in `client/src/index.css` or similar):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add any additional global styles here */
```

---

## 2. Navigation Menu Implementation

### Step 1: Create AppShell Component

Create a file for the AppShell component:
```
mkdir -p client/src/components/shell
touch client/src/components/shell/AppShell.tsx
```

### Step 2: Add the Theme Toggle Component First

Before implementing the AppShell, make sure you have the theme toggle component:

```bash
mkdir -p client/src/components/ui
```

Create file at `client/src/components/ui/theme-toggle-fixed.tsx` with:

```tsx
import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from 'lucide-react';

export default function ThemeToggleFixed() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('accessweb-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initialIsDark = false;

    if (savedTheme) {
      initialIsDark = savedTheme === 'dark';
    } else {
      initialIsDark = prefersDark;
    }

    setIsDarkMode(initialIsDark);
    updateThemeClasses(initialIsDark);

    console.log('Initializing theme');
    console.log('Theme classes after initialization:', document.documentElement.classList.toString());
  }, []);

  const toggleTheme = () => {
    console.log('Toggling theme');
    console.log('Current dark mode:', isDarkMode);
    console.log('Current classes:', document.documentElement.classList.toString());

    const newIsDark = !isDarkMode;
    setIsDarkMode(newIsDark);
    updateThemeClasses(newIsDark);

    console.log(newIsDark ? 'Switched to dark mode' : 'Switched to light mode');
    console.log('Updated classes:', document.documentElement.classList.toString());
  };

  const updateThemeClasses = (isDark: boolean) => {
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.remove('light');
      root.classList.add('dark');
      localStorage.setItem('accessweb-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      localStorage.setItem('accessweb-theme', 'light');
    }
  };

  return (
    <button
      type="button"
      className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5 text-[#0fae96]" />
      ) : (
        <MoonIcon className="h-5 w-5 text-[#0fae96]" />
      )}
    </button>
  );
}
```

### Step 3: Copy ENTIRE AppShell Component

Create the file at `client/src/components/shell/AppShell.tsx` and paste this ENTIRE code:

```tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import ThemeToggleFixed from '@/components/ui/theme-toggle-fixed';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
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
              <Link href="/">
                <a className="flex items-center">
                  <span className="text-xl font-bold text-[#0fae96] dark:text-[#5eead4]">AccessWebPro</span>
                </a>
              </Link>

              {/* Main Navigation - Desktop */}
              <nav className="hidden md:flex items-center space-x-4">
                <Link href="/checker">
                  <a className={`px-3 py-2 ${isActive('/checker') 
                    ? 'text-[#0fae96] dark:text-[#5eead4]' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4]'} transition-colors`}>
                    WCAG Checker
                  </a>
                </Link>
                <Link href="/resources">
                  <a className={`px-3 py-2 ${isActive('/resources') 
                    ? 'text-[#0fae96] dark:text-[#5eead4]' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4]'} transition-colors`}>
                    Resources
                  </a>
                </Link>
                <Link href="/dashboard">
                  <a className={`px-3 py-2 ${isActive('/dashboard') 
                    ? 'text-[#0fae96] dark:text-[#5eead4]' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4]'} transition-colors`}>
                    Dashboard
                  </a>
                </Link>
              </nav>
            </div>

            {/* Right side navigation items */}
            <div className="flex items-center gap-4">
              <Link href="/signin">
                <a className="hidden sm:inline-block px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
                  Sign In
                </a>
              </Link>
              <Link href="/signup">
                <a className="hidden sm:inline-block px-4 py-2 rounded-full bg-[#0066FF] hover:bg-[#0066FF]/90 text-white">
                  Sign Up
                </a>
              </Link>

              {/* Mobile menu button - only shown on small screens */}
              <button 
                className="md:hidden rounded-full p-2 hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 text-gray-700 dark:text-gray-300"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} border-t border-gray-200 dark:border-slate-700`}>
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link href="/checker">
                <a 
                  className={`px-3 py-2 ${isActive('/checker') ? 'text-[#0fae96] dark:text-[#5eead4]' : 'text-gray-700 dark:text-gray-300'}`}
                  onClick={closeMenu}
                >
                  WCAG Checker
                </a>
              </Link>
              <Link href="/resources">
                <a 
                  className={`px-3 py-2 ${isActive('/resources') ? 'text-[#0fae96] dark:text-[#5eead4]' : 'text-gray-700 dark:text-gray-300'}`}
                  onClick={closeMenu}
                >
                  Resources
                </a>
              </Link>
              <Link href="/dashboard">
                <a 
                  className={`px-3 py-2 ${isActive('/dashboard') ? 'text-[#0fae96] dark:text-[#5eead4]' : 'text-gray-700 dark:text-gray-300'}`}
                  onClick={closeMenu}
                >
                  Dashboard
                </a>
              </Link>
              <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-slate-700">
                <Link href="/signin">
                  <a 
                    className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 text-sm"
                    onClick={closeMenu}
                  >
                    Sign In
                  </a>
                </Link>
                <Link href="/signup">
                  <a 
                    className="px-4 py-2 rounded-full bg-[#0066FF] hover:bg-[#0066FF]/90 text-white text-sm"
                    onClick={closeMenu}
                  >
                    Sign Up
                  </a>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1 bg-gray-50 dark:bg-slate-900">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">About</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Team</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Guides</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Case Studies</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Documentation</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">GDPR</a></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">Twitter</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">LinkedIn</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">GitHub</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">YouTube</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-slate-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-400">
            &copy; {new Date().getFullYear()} AccessWebPro. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Theme toggle fixed button */}
      <ThemeToggleFixed />
    </div>
  );
}
```

### Step 4: Update App.tsx to Use AppShell

**CRITICAL**: Update your App.tsx file to use the AppShell component:

```tsx
import React from 'react';
import { Route, Switch } from 'wouter';
import { AppShell } from '@/components/shell/AppShell';
import HomePage from '@/pages/index';
import CheckerPage from '@/pages/checker';
// Import other pages as needed

function App() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/checker" component={CheckerPage} />
        {/* Add other routes as needed */}
      </Switch>
    </AppShell>
  );
}

export default App;
```

### Step 5: Install Required Packages

Make sure you have the Lucide React package installed for icons:

```bash
npm install lucide-react
```

---

## 3. Troubleshooting Common Issues

### Issue: Navigation Menu Shows Duplicated Links/Content

This happens when you've added the AppShell but there's already navigation in your existing App component.

**Solution**:
1. Open your App.tsx file
2. Look for any existing navigation elements (usually a `<nav>`, `<header>`, or similar)
3. **COMPLETELY REMOVE** the existing navigation
4. Make sure you've wrapped your entire application in the AppShell component as shown above

### Issue: Home Page Not Showing Up

This typically happens when the route is not correctly defined.

**Solution**:
1. Check your App.tsx file to make sure the route for "/" is correctly defined
2. Make sure you've imported the HomePage component correctly
3. Check the console for any React errors

### Issue: Styling Not Applied Correctly

This can happen if the Tailwind CSS configuration is not set up correctly.

**Solution**:
1. Make sure your tailwind.config.js or tailwind.config.ts includes:
   ```js
   darkMode: ["class"],
   content: [
     './components/**/*.{ts,tsx}',
     './src/**/*.{ts,tsx}',
     './client/**/*.{ts,tsx}',
   ],
   ```
2. Ensure your CSS imports include the Tailwind directives
3. Check if any other CSS is overriding the styles (you might need to use more specific selectors)

### Issue: Dark Mode Not Working

**Solution**:
1. Make sure the ThemeToggleFixed component is correctly implemented
2. Verify the "dark" class is being added to the HTML element
3. Check your Tailwind configuration for `darkMode: ["class"]`

### Issue: Error "Cannot find module '@/components...'"

This happens when the path aliases are not set up correctly.

**Solution**:
1. Check your tsconfig.json or vite.config.ts for path aliases
2. You may need to modify the import to use relative paths instead:
   ```tsx
   // Replace
   import ThemeToggleFixed from '@/components/ui/theme-toggle-fixed';

   // With
   import ThemeToggleFixed from '../../components/ui/theme-toggle-fixed';
   // Or whatever the correct relative path is
   ```

### Important Notes About Path Resolution

If you encounter path resolution issues, you might need to adjust the import paths based on your project structure. Here are common patterns:

For a typical structure:
```
client/
  src/
    components/
      ui/
        theme-toggle-fixed.tsx
      shell/
        AppShell.tsx
    pages/
      index.tsx
      checker.tsx
    App.tsx
```

The imports would be:
```tsx
// In AppShell.tsx
import ThemeToggleFixed from '../ui/theme-toggle-fixed';
// or 
import ThemeToggleFixed from '../../components/ui/theme-toggle-fixed';

// In App.tsx
import { AppShell } from './components/shell/AppShell';
import HomePage from './pages/index';
```

**The key is to match your actual project structure.**