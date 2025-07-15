import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Menu,
  X,
  CheckCircle,
  ArrowRight,
  Sun,
  Moon
} from "lucide-react";
import NavDropdown from "./navbar-dropdown";
import NavigationIcons from "../navigation/NavigationIconGuide";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  // Toggle dark mode function
  const toggleTheme = () => {
    console.log("Toggling theme");
    const root = window.document.documentElement;
    const isDark = root.classList.contains("dark");
    
    // Log current state
    console.log("Current dark mode:", isDark);
    console.log("Current classes:", root.classList.toString());
    
    if (isDark) {
      // Switch to light mode
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("accessweb-theme", "light");
      document.body.style.colorScheme = "light";
      root.setAttribute('data-theme', 'light');
      setDarkMode(false);
      console.log("Switched to light mode");
    } else {
      // Switch to dark mode
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("accessweb-theme", "dark");
      document.body.style.colorScheme = "dark";
      root.setAttribute('data-theme', 'dark');
      setDarkMode(true);
      console.log("Switched to dark mode");
    }
    
    // Force a repaint to ensure all elements update correctly
    setTimeout(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger a reflow
      document.body.style.display = '';
    }, 10);
    
    // Log updated state
    console.log("Updated classes:", root.classList.toString());
  };
  
  // Effect to listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Handle scroll events to add shadow when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Tools dropdown items
  const toolsDropdownItems = [
    { 
      icon: NavigationIcons.tools.wcagChecker, 
      label: 'WCAG Checker',
      description: 'Test your website against WCAG standards',
      href: '/tools/wcag-checker'
    },
    { 
      icon: NavigationIcons.tools.colorPalette, 
      label: 'Color Palette',
      description: 'Create accessible color combinations',
      href: '/tools/color-palette'
    },
    { 
      icon: NavigationIcons.tools.colorSimulator, 
      label: 'Color Accessibility Simulator',
      description: 'Test colors for accessibility',
      href: '/tools/color-simulator'
    },
    { 
      icon: NavigationIcons.tools.wcagStandards, 
      label: 'WCAG Standards',
      description: 'Browse WCAG 2.1 standards',
      href: '/tools/wcag-standards'
    }
  ];

  // Integrations dropdown items
  const integrationsDropdownItems = [
    { 
      icon: NavigationIcons.integrations.shopify, 
      label: 'Shopify',
      description: 'Integrate with your Shopify store',
      href: '/integrations/shopify'
    },
    { 
      icon: NavigationIcons.integrations.wordpress, 
      label: 'WordPress',
      description: 'Add accessibility to your WordPress site',
      href: '/integrations/wordpress'
    },
    { 
      icon: NavigationIcons.integrations.api, 
      label: 'API',
      description: 'Connect with our RESTful API',
      href: '/integrations/api'
    },
    { 
      icon: NavigationIcons.integrations.compliance, 
      label: 'Compliance',
      description: 'Enterprise-grade compliance reports',
      href: '/integrations/compliance'
    },
    { 
      icon: NavigationIcons.integrations.enterprise, 
      label: 'Enterprise',
      description: 'Custom solutions for large organizations',
      href: '/integrations/enterprise'
    }
  ];

  // Resources dropdown items
  const resourcesDropdownItems = [
    { 
      icon: NavigationIcons.resources.documentation, 
      label: 'Documentation',
      description: 'Technical guides and API docs',
      href: '/resources/documentation'
    },
    { 
      icon: NavigationIcons.resources.helpCenter, 
      label: 'Help Center',
      description: 'FAQs and troubleshooting',
      href: '/resources/help-center'
    },
    { 
      icon: NavigationIcons.resources.blog, 
      label: 'Blog',
      description: 'Articles and accessibility updates',
      href: '/resources/blog'
    }
  ];

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" }
  ];

  return (
    <header className={`fixed w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg z-50 ${scrolled ? 'shadow-md' : ''} transition-all duration-300 border-b border-gray-100 dark:border-gray-800`} style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(16px)' }}>
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-full bg-[#e0f5f1] dark:bg-[#0fae96]/20 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4]" />
          </div>
          <span className="text-xl font-bold text-gray-800 dark:text-white">AccessWeb<span className="text-[#0fae96] dark:text-[#5eead4]">Pro</span></span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {/* Tools Dropdown */}
          <NavDropdown label="Tools" items={toolsDropdownItems} />
          
          {/* Integrations Dropdown */}
          <NavDropdown label="Integrations" items={integrationsDropdownItems} />
          
          {/* Resources Dropdown */}
          <NavDropdown label="Resources" items={resourcesDropdownItems} />
          
          {/* Regular nav items */}
          {navItems.map((item, index) => (
            <a 
              key={index}
              href={item.href} 
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-[15px] font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <a href="#" className="hidden md:inline-block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium transition-colors">
            Login
          </a>
          <Button 
            className="bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 text-white rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 flex items-center"
          >
            Start Free Trial <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
          
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => {
              console.log("Mobile menu toggle clicked, current state:", isMenuOpen);
              setIsMenuOpen(!isMenuOpen);
            }}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 px-6 py-6 overflow-hidden absolute w-full left-0 shadow-lg"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)' }}
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Tools Section */}
            <div className="py-2 mb-4">
              <h3 className="font-medium text-base mb-3 text-gray-900 dark:text-[#5eead4]">Tools</h3>
              {toolsDropdownItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <a className="block py-2.5 px-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 rounded-lg transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center mb-1">
                      <item.icon className="h-4 w-4 mr-2.5 text-[#0fae96] dark:text-[#5eead4]" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="pl-6.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap text-ellipsis overflow-hidden">
                      {item.description}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            
            {/* Integrations Section */}
            <div className="py-2 mb-4">
              <h3 className="font-medium text-base mb-3 text-gray-900 dark:text-[#5eead4]">Integrations</h3>
              {integrationsDropdownItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <a className="block py-2.5 px-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 rounded-lg transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center mb-1">
                      <item.icon className="h-4 w-4 mr-2.5 text-[#0fae96] dark:text-[#5eead4]" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="pl-6.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap text-ellipsis overflow-hidden">
                      {item.description}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            
            {/* Resources Section */}
            <div className="py-2 mb-4">
              <h3 className="font-medium text-base mb-3 text-gray-900 dark:text-[#5eead4]">Resources</h3>
              {resourcesDropdownItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <a className="block py-2.5 px-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 rounded-lg transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                    <div className="flex items-center mb-1">
                      <item.icon className="h-4 w-4 mr-2.5 text-[#0fae96] dark:text-[#5eead4]" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="pl-6.5 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap text-ellipsis overflow-hidden">
                      {item.description}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
            
            {/* Regular Nav Items */}
            <div className="grid grid-cols-2 gap-2 py-3">
              {navItems.map((item, index) => (
                <a 
                  key={index}
                  href={item.href} 
                  className="py-2.5 px-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between py-3">
                <a 
                  href="#" 
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTheme();
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors"
                  aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
              <Button 
                className="w-full mt-3 bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 transition-all duration-200 rounded-full px-5 py-2.5 text-white text-sm font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Free Trial <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
