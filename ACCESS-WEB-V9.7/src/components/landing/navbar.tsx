import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  CheckCircle,
  ArrowRight,
  Sun,
  Moon,
  User,
  LogOut
} from "lucide-react";
import NavDropdown from "./navbar-dropdown";
import NavigationIcons from "../navigation/NavigationIconGuide";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
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
      href: '/checker'
    },
    { 
      icon: NavigationIcons.tools.colorPalette, 
      label: 'Color Palette',
      description: 'Create accessible color combinations',
      href: '/tools/colors'
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
    },
    { 
      icon: NavigationIcons.tools.imageAltScanner, 
      label: 'Image Alt Scanner',
      description: 'Find and fix image accessibility issues',
      href: '/tools/image-alt-scanner'
    }
  ];

  // Integrations dropdown items
  const integrationsDropdownItems = [
    { 
      icon: NavigationIcons.integrations.shopify, 
      label: 'Shopify',
      description: 'Shopify theme accessibility',
      href: '/integrations/shopify'
    },
    { 
      icon: NavigationIcons.integrations.wordpress, 
      label: 'WordPress',
      description: 'WordPress site accessibility',
      href: '/wordpressint'
    },
    { 
      icon: NavigationIcons.integrations.api, 
      label: 'Custom API',
      description: 'API integration & webhooks',
      href: '/integrations/api'
    },
    { 
      icon: NavigationIcons.integrations.compliance, 
      label: 'Compliance',
      description: 'Compliance monitoring & reporting',
      href: '/integrations/compliance'
    },
    { 
      icon: NavigationIcons.integrations.enterprise, 
      label: 'Enterprise',
      description: 'Enterprise-grade solutions',
      href: '/integrations/enterprise'
    }
  ];

  // Resources dropdown items
  const resourcesDropdownItems = [
    { 
      icon: NavigationIcons.resources.documentation, 
      label: 'Documentation',
      description: 'Technical guides and API docs',
      href: '/docs'
    },
    { 
      icon: NavigationIcons.resources.helpCenter, 
      label: 'Help Center',
      description: 'FAQs and troubleshooting',
      href: '/help'
    },
    { 
      icon: NavigationIcons.resources.blog, 
      label: 'Blog',
      description: 'Articles and updates',
      href: '/blog'
    },
    { 
      icon: NavigationIcons.resources.nonDestructiveFixes, 
      label: 'Non-Destructive Fixes',
      description: 'CSS-based accessibility fixes',
      href: '/non-destructive-fixes'
    }
  ];
  
  // My Account dropdown items
  const accountDropdownItems = [
    {
      icon: NavigationIcons.userDashboard.overview,
      label: 'Account Dashboard',
      description: 'View your account dashboard',
      href: '/my-account'
    },
    {
      icon: NavigationIcons.userDashboard.websites,
      label: 'Monitoring & Compliance',
      description: 'Real-time monitoring & compliance',
      href: '/my-account/monitoring'
    },
    {
      icon: NavigationIcons.adminDashboard.analytics,
      label: 'Analytics',
      description: 'Accessibility analytics and insights',
      href: '/my-account/analytics'
    },
    {
      icon: NavigationIcons.userDashboard.webhooks,
      label: 'Alerts',
      description: 'Configure accessibility alerts',
      href: '/my-account/alerts'
    },
    {
      icon: NavigationIcons.userDashboard.connectedServices,
      label: 'Connections',
      description: 'Manage API and platform connections',
      href: '/my-account/connections'
    },
    {
      icon: NavigationIcons.userDashboard.preferences,
      label: 'Settings',
      description: 'Manage account settings',
      href: '/my-account/settings'
    },
    {
      icon: NavigationIcons.userDashboard.billing,
      label: 'Billing',
      description: 'Manage billing and subscriptions',
      href: '/my-account/billing'
    },
    {
      icon: NavigationIcons.userDashboard.teamMembers,
      label: 'Team',
      description: 'Manage team members',
      href: '/my-account/team'
    }
  ];

  const navItems = [
    { label: "Pricing", href: "/pricing" }
  ];

  return (
    <header className={`fixed w-full bg-background/95 dark:bg-background/95 backdrop-blur-sm z-50 ${scrolled ? 'shadow-sm' : ''} transition-shadow duration-300`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <div className="w-10 h-10 rounded-xl bg-[#e0f5f1] dark:bg-[#0fae96]/20 flex items-center justify-center mr-1">
            <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4]" />
          </div>
          <span className="text-xl font-bold text-foreground dark:text-foreground">AccessWeb<span className="text-[#0fae96] dark:text-[#5eead4]">Pro</span></span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {/* Tools Dropdown */}
          <NavDropdown label="Tools" items={toolsDropdownItems} />
          
          {/* Integrations Dropdown */}
          <NavDropdown label="Integrations" items={integrationsDropdownItems} />
          
          {/* Resources Dropdown */}
          <NavDropdown label="Resources" items={resourcesDropdownItems} />
          
          {/* My Account Dropdown */}
          <NavDropdown 
            label="My Account" 
            items={accountDropdownItems} 
            icon={<User className="h-4 w-4 mr-1" />} 
          />
          
          {/* Regular nav items */}
          {navItems.map((item, index) => (
            <Link 
              key={index}
              to={item.href} 
              className="text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white text-base font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-5">
          {loading ? (
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0fae96] border-t-transparent"></div>
          ) : user ? (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-muted-foreground dark:text-gray-300">
                  {user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="flex items-center text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
              <Link to="/my-account">
                <Button 
                  className="bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 transition-all duration-300 rounded-full px-6 text-white"
                >
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:inline-block text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white text-base font-medium transition-colors">
                Login
              </Link>
              <Link to="/register">
                <Button 
                  className="bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 transition-all duration-300 rounded-full px-6 text-white"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
          
          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white transition-colors"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background border-t border-border px-4 py-4 overflow-hidden absolute w-full left-0 dark:bg-slate-900"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {/* Tools Section */}
            <div className="py-2 mb-2">
              <h3 className="font-medium text-base mb-2 dark:text-[#86e4d4]">Tools</h3>
              {toolsDropdownItems.map((item, index) => (
                <Link key={index} to={item.href} className="block py-2 pl-3 text-muted-foreground hover:text-foreground hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 rounded-md transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center mb-1">
                    <item.icon className="h-4 w-4 mr-2 text-[#0fae96] dark:text-[#5eead4]" />
                    <span className="dark:text-white">{item.label}</span>
                  </div>
                  <div className="pl-7 text-base text-muted-foreground dark:text-[#86e4d4] whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.description}
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Integrations Section */}
            <div className="py-2 mb-2">
              <h3 className="font-medium text-base mb-2 dark:text-[#86e4d4]">Integrations</h3>
              {integrationsDropdownItems.map((item, index) => (
                <Link key={index} to={item.href} className="block py-2 pl-3 text-muted-foreground hover:text-foreground hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 rounded-md transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center mb-1">
                    <item.icon className="h-4 w-4 mr-2 text-[#0fae96] dark:text-[#5eead4]" />
                    <span className="dark:text-white">{item.label}</span>
                  </div>
                  <div className="pl-7 text-base text-muted-foreground dark:text-[#86e4d4] whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.description}
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Resources Section */}
            <div className="py-2 mb-2">
              <h3 className="font-medium text-base mb-2 dark:text-[#86e4d4]">Resources</h3>
              {resourcesDropdownItems.map((item, index) => (
                <Link key={index} to={item.href} className="block py-2 pl-3 text-muted-foreground hover:text-foreground hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 rounded-md transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center mb-1">
                    <item.icon className="h-4 w-4 mr-2 text-[#0fae96] dark:text-[#5eead4]" />
                    <span className="dark:text-white">{item.label}</span>
                  </div>
                  <div className="pl-7 text-base text-muted-foreground dark:text-[#86e4d4] whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.description}
                  </div>
                </Link>
              ))}
            </div>
            
            {/* My Account Section */}
            <div className="py-2 mb-2">
              <h3 className="font-medium text-base mb-2 dark:text-[#86e4d4]">My Account</h3>
              {accountDropdownItems.map((item, index) => (
                <Link key={index} to={item.href} className="block py-2 pl-3 text-muted-foreground hover:text-foreground hover:bg-[#0fae96]/5 dark:hover:bg-[#0fae96]/10 rounded-md transition-all duration-200" onClick={() => setIsMenuOpen(false)}>
                  <div className="flex items-center mb-1">
                    <item.icon className="h-4 w-4 mr-2 text-[#0fae96] dark:text-[#5eead4]" />
                    <span className="dark:text-white">{item.label}</span>
                  </div>
                  <div className="pl-7 text-base text-muted-foreground dark:text-[#86e4d4] whitespace-nowrap text-ellipsis overflow-hidden">
                    {item.description}
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Regular Nav Items */}
            {navItems.map((item, index) => (
              <Link 
                key={index}
                to={item.href} 
                className="block py-3 text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 mt-3 border-t border-border">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0fae96] border-t-transparent"></div>
                </div>
              ) : user ? (
                <div className="py-3">
                  <div className="flex items-center mb-3">
                    <User className="h-5 w-5 mr-2 text-[#0fae96] dark:text-[#5eead4]" />
                    <span className="text-foreground dark:text-white truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link 
                      to="/my-account" 
                      className="text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTheme();
                      }}
                      className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white transition-colors"
                      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                  </div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full mt-3 flex items-center justify-center bg-red-100 hover:bg-red-200 dark:bg-red-950/30 dark:hover:bg-red-950/50 text-red-600 dark:text-red-400 py-2 px-4 rounded-full font-medium transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between py-3">
                    <Link 
                      to="/login" 
                      className="text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTheme();
                      }}
                      className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white transition-colors"
                      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                  </div>
                  <Link to="/register" className="w-full">
                    <Button 
                      className="w-full mt-3 bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 transition-all duration-300 rounded-full px-6 text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
