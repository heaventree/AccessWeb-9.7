# AccessWebPro UI Skin Implementation Guide

This comprehensive guide provides step-by-step instructions for implementing the AccessWebPro UI skin, with special focus on replicating the home page and navigation.

## Table of Contents

1. [Setting Up the Theme Foundation](#1-setting-up-the-theme-foundation)
2. [Implementing the Theme Toggle](#2-implementing-the-theme-toggle)
3. [Styling the WCAG Checker Page](#3-styling-the-wcag-checker-page)
4. [Home Page Implementation](#4-home-page-implementation)
5. [Navigation/Menu Implementation](#5-navigationmenu-implementation)
6. [Common Component Styling Patterns](#6-common-component-styling-patterns)
7. [Debugging Common Issues](#7-debugging-common-issues)
8. [Implementation Checklist](#8-implementation-checklist)

## 1. Setting Up the Theme Foundation

### Step 1: Add Global CSS Variables

First, create or modify your global CSS file:

```bash
# Create or edit the global CSS file
nano client/src/styles/global-theme.css
```

Copy the CSS variables from `handover/theme_variables.css` into this file. These variables define all colors for both light and dark mode.

### Step 2: Update Tailwind Configuration

Modify your `tailwind.config.ts` file:

```bash
# Edit the Tailwind config
nano tailwind.config.ts
```

Update it using the configuration from `handover/tailwind_config_update.md`, which includes:
- Color definitions for primary, secondary, and semantic colors
- Border radius variables
- Dark mode class-based implementation

### Step 3: Update Theme.json

```bash
# Edit theme.json
nano theme.json
```

Replace with:
```json
{
  "primary": "#0fae96",
  "variant": "tint",
  "appearance": "system",
  "radius": 12
}
```

## 2. Implementing the Theme Toggle

### Step 1: Create Theme Toggle Component

```bash
# Create the theme toggle component
mkdir -p client/src/components/ui
nano client/src/components/ui/theme-toggle-fixed.tsx
```

Copy the code from `handover/theme_toggle_component.tsx` into this file.

### Step 2: Add Theme Toggle to Layout

Add the theme toggle component to your main layout or App component:

```tsx
import ThemeToggleFixed from "@/components/ui/theme-toggle-fixed";

// In your layout component:
return (
  <div>
    {/* Other layout elements */}
    <ThemeToggleFixed />
  </div>
);
```

## 3. Styling the WCAG Checker Page

### Step 1: Update the WCAG Checker Page

```bash
# Edit the WCAG Checker page
nano client/src/pages/checker.tsx
```

Replace with the code from `handover/wcag_checker_page_style.md`, which includes:
- Properly styled container with updated color scheme
- Country tabs with hover and active states
- Standards pills with appropriate colors
- Testing options with proper checkbox styling
- URL input and button with the correct branding colors

### Step 2: Key Style Changes for the Checker Page

- Updated container: `max-w-3xl mx-auto bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-8`
- Country tabs: Use `rounded-full` with proper active state: `bg-[#e6f8f5] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4]`
- Testing options section: Use `bg-[#0fae96]/5 dark:bg-[#0fae96]/10 rounded-lg p-4`
- Check button: Use `bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-6 py-2 rounded-full`

## 4. Home Page Implementation

### Step 1: Create the Home Page Component

```bash
# Edit the home page component
nano client/src/pages/index.tsx
```

### Step 2: Full Home Page Implementation Code

Copy and paste this complete implementation of the home page:

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

### Step 3: Key Elements of the Home Page

The home page implementation includes:

1. **Hero Section**
   - A large heading with the brand name and value proposition
   - A colorful accent on key words using the primary teal/mint color
   - Two call-to-action buttons (primary and secondary)

2. **Features Section**
   - Three feature cards with icons in the primary color
   - Each card has a light background in light mode and dark background in dark mode
   - Consistent heading and text styling with proper contrast

3. **Stats Section**
   - Four statistics in a grid layout
   - Numbers highlighted in the primary teal/mint color
   - Card container with proper border and shadow

4. **CTA Section**
   - Background using a light tint of the primary color (5% opacity in light mode, 10% in dark mode)
   - Clear heading and subtext
   - Prominent call-to-action button

### Step 4: Key Styling Patterns in Home Page

- **Hero Section**: Large text with accent color `text-[#0fae96] dark:text-[#5eead4]`
- **Buttons**: 
  - Primary: `bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-8 py-3 rounded-full`
  - Secondary: `bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 px-8 py-3 rounded-full`
- **Feature Cards**:
  - Container: `bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200`
  - Icon container: `rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4`
  - Icon: `h-6 w-6 text-[#0fae96] dark:text-[#5eead4]`
- **Statistics**:
  - Numbers: `text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2`
  - Labels: `text-gray-600 dark:text-gray-400`
- **CTA Background**: `bg-[#0fae96]/5 dark:bg-[#0fae96]/10`

## 5. Navigation/Menu Implementation

### Step 1: Create AppShell Component

```bash
# Create the AppShell component
mkdir -p client/src/components/shell
nano client/src/components/shell/AppShell.tsx
```

### Step 2: Full Navigation Implementation Code

Copy and paste this complete implementation:

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

### Step 3: Integrate AppShell in Main App

Update your main App.tsx file to use the AppShell:

```tsx
import React from 'react';
import { Route, Switch } from 'wouter';
import { AppShell } from '@/components/shell/AppShell';
import HomePage from '@/pages/index';
import CheckerPage from '@/pages/checker';
// Import other pages...

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

### Step 4: Key Elements of the Navigation

The navigation implementation includes:

1. **Header Bar**
   - Logo/brand name in the primary teal/mint color
   - Desktop navigation links with active state styling
   - Authentication buttons (Sign In/Sign Up)
   - Mobile menu toggle (hamburger icon)

2. **Mobile Menu**
   - Responsive design that shows/hides based on screen size
   - Same navigation links as desktop but in a vertical layout
   - Authentication buttons below the navigation links

3. **Footer**
   - Four columns of links organized by category
   - Copyright notice at the bottom
   - Consistent styling with proper spacing

4. **Accessibility Features**
   - Skip to content link for keyboard users
   - ARIA attributes for the mobile menu
   - Clear active states for navigation

### Step 5: Key Styling Patterns in Navigation

- **Brand name**: `text-xl font-bold text-[#0fae96] dark:text-[#5eead4]`
- **Nav links**: 
  - Default: `text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4]`
  - Active: `text-[#0fae96] dark:text-[#5eead4]`
- **Buttons**:
  - Sign In: `px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700`
  - Sign Up: `px-4 py-2 rounded-full bg-[#0066FF] hover:bg-[#0066FF]/90 text-white`
- **Mobile menu toggle**: `rounded-full p-2 hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10`
- **Footer headings**: `text-lg font-semibold text-gray-900 dark:text-white mb-4`
- **Footer links**: `text-gray-600 dark:text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]`

## 6. Common Component Styling Patterns

For any custom components your team needs to create, follow these patterns from the style guide:

### Buttons

```tsx
// Primary button
<button className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-6 py-2 rounded-full">
  Primary Action
</button>

// Secondary button
<button className="bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 px-6 py-2 rounded-full">
  Secondary Action
</button>
```

### Cards

```tsx
// Basic card
<div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
  Card content
</div>

// Feature card with icon
<div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
  <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
    <svg className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]">
      {/* Icon SVG */}
    </svg>
  </div>
  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Feature Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Feature description</p>
</div>
```

### Form Elements

```tsx
// Input field
<input
  type="text"
  className="border border-gray-200 dark:border-slate-700 rounded-lg p-3 text-base w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus-visible:ring-1 focus-visible:ring-[#0fae96] focus-visible:outline-none"
  placeholder="Enter text"
/>

// Checkbox
<div className="flex items-center">
  <input 
    type="checkbox" 
    id="checkbox-id"
    className="rounded border-gray-300 text-[#0fae96] focus:ring-[#0fae96] h-5 w-5" 
  />
  <label htmlFor="checkbox-id" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
    Checkbox Label
  </label>
</div>
```

## 7. Debugging Common Issues

If the team encounters issues during implementation, here are common problems and solutions:

### Dark Mode Not Working

1. Check that the theme toggle component is correctly adding/removing the `dark` class on the HTML element
2. Verify that `darkMode: ["class"]` is in Tailwind config
3. Ensure global CSS variables have proper dark mode overrides

```js
// In tailwind.config.js
module.exports = {
  darkMode: ["class"],
  // ...rest of config
}
```

### Colors Not Matching Design

1. Verify that color variables in CSS are properly defined
2. Check that Tailwind config is correctly extended with custom colors
3. Ensure the correct color classes are being used (e.g., `text-[#0fae96]` instead of hardcoded values)

### Layout Not Responsive

1. Use mobile-first approach with Tailwind breakpoints (`md:`, `lg:`)
2. Test at various viewport sizes
3. Ensure container classes are properly applied

```html
<!-- Example of mobile-first responsive design -->
<div className="flex flex-col md:flex-row">
  <div className="w-full md:w-1/2">Column 1</div>
  <div className="w-full md:w-1/2">Column 2</div>
</div>
```

### Component Styling Issues

1. Check for CSS specificity issues (more specific selectors overriding your styles)
2. Verify that all class names are spelled correctly
3. Ensure dark mode variants are included where needed

## 8. Implementation Checklist

To ensure complete implementation, follow this checklist:

- [ ] Theme foundation is set up (CSS variables, Tailwind config)
- [ ] Theme toggle component is working
- [ ] WCAG Checker page is styled correctly
- [ ] Navigation/menu is updated with new styling
- [ ] Home page is updated with new styling
- [ ] All components use consistent styling patterns
- [ ] Dark mode works correctly throughout the app
- [ ] All elements are accessible (contrast, focus states)
- [ ] Responsive design works on all screen sizes

## Conclusion

This comprehensive guide provides all the necessary steps and code to implement the AccessWebPro UI skin across your application. The home page and navigation implementations are especially detailed to help your team replicate these key components.

If your team encounters specific issues during implementation, refer to the debugging section or the specific component guidelines provided in the handover package.