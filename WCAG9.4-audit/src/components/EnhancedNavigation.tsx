import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Settings, Globe, Book, HelpCircle, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { FeedbackToggle } from './FeedbackToggle';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';

// Original navigation data moved to this component for consistency
import { 
  tools, 
  integrations, 
  resources, 
  accountItems 
} from './NavigationData';

/**
 * Enhanced Navigation component that preserves all the functionality of the original
 * Navigation component while applying the new UI theme styling.
 * 
 * This component can be toggled on/off via the UIEnhancementContext
 */
export function EnhancedNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const { isEnhanced } = useUIEnhancement();

  // Add sticky behavior on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu and dropdowns when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  // Handle body scroll lock
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-trigger')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDropdownClick = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const mobileMenuVariants = {
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  };

  const dropdownVariants = {
    closed: {
      opacity: 0,
      y: -4,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.15,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <header className={`fixed w-full z-50 cs_site_header cs_style_1 cs_sticky_header ${isSticky ? 'cs_sticky' : ''}`}>
      <div className="cs_main_header cs_fs_18 cs_heading_color">
        <div className="container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center cs_site_branding">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  AccessWeb
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 cs_nav">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Home</Link>
              <div className="relative dropdown-trigger">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick('tools');
                  }}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Settings className="w-5 h-5 mr-2" />
                  Tools
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'tools' && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={dropdownVariants}
                      className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 cs_white_bg cs_radius_15"
                    >
                      {tools.map(tool => (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <tool.icon className="w-5 h-5 mr-3 text-gray-400" />
                          <div>
                            <div className="font-medium">{tool.name}</div>
                            <div className="text-xs text-gray-500">{tool.description}</div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative dropdown-trigger">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick('integrations');
                  }}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ml-4"
                >
                  <Globe className="w-5 h-5 mr-2" />
                  Integrations
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'integrations' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'integrations' && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={dropdownVariants}
                      className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 cs_white_bg cs_radius_15"
                    >
                      {integrations.map(integration => (
                        <Link
                          key={integration.path}
                          to={integration.path}
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <integration.icon className="w-5 h-5 mr-3 text-gray-400" />
                          <div>
                            <div className="font-medium">{integration.name}</div>
                            <div className="text-xs text-gray-500">{integration.description}</div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative dropdown-trigger">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick('resources');
                  }}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <Book className="w-5 h-5 mr-2" />
                  Resources
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'resources' && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={dropdownVariants}
                      className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 cs_white_bg cs_radius_15"
                    >
                      {resources.map(resource => (
                        <Link
                          key={resource.path}
                          to={resource.path}
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <resource.icon className="w-5 h-5 mr-3 text-gray-400" />
                          <div>
                            <div className="font-medium">{resource.name}</div>
                            <div className="text-xs text-gray-500">{resource.description}</div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Pricing</Link>

              <div className="relative dropdown-trigger">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDropdownClick('account');
                  }}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <User className="w-5 h-5 mr-2" />
                  My Account
                  <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'account' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'account' && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={dropdownVariants}
                      className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 cs_white_bg cs_radius_15"
                    >
                      {accountItems.map(item => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <item.icon className="w-5 h-5 text-gray-400" />
                          <div className="ml-3">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/help" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <HelpCircle className="w-5 h-5" />
              </Link>
              <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                <Settings className="w-5 h-5" />
              </Link>
              <ThemeToggle />
              <FeedbackToggle />
              <Link
                to="/signup"
                className="ml-8 inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 cs_btn"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="block h-6 w-6" aria-hidden="true" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, rotate: 90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: -90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="block h-6 w-6" aria-hidden="true" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-gray-900 shadow-lg overflow-hidden cs_white_bg"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Accordion Menus */}
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  className="flex justify-between w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => handleDropdownClick('mobile-tools')}
                >
                  <span className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Tools
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      activeDropdown === 'mobile-tools' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'mobile-tools' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-gray-50 dark:bg-gray-800"
                    >
                      {tools.map((tool) => (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ml-6"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {tool.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  className="flex justify-between w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => handleDropdownClick('mobile-integrations')}
                >
                  <span className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Integrations
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      activeDropdown === 'mobile-integrations' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'mobile-integrations' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-gray-50 dark:bg-gray-800"
                    >
                      {integrations.map((integration) => (
                        <Link
                          key={integration.path}
                          to={integration.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ml-6"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {integration.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  className="flex justify-between w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => handleDropdownClick('mobile-resources')}
                >
                  <span className="flex items-center">
                    <Book className="w-5 h-5 mr-2" />
                    Resources
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      activeDropdown === 'mobile-resources' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'mobile-resources' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-gray-50 dark:bg-gray-800"
                    >
                      {resources.map((resource) => (
                        <Link
                          key={resource.path}
                          to={resource.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ml-6"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {resource.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>

              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  className="flex justify-between w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  onClick={() => handleDropdownClick('mobile-account')}
                >
                  <span className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    My Account
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      activeDropdown === 'mobile-account' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'mobile-account' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden bg-gray-50 dark:bg-gray-800"
                    >
                      {accountItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ml-6"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4 flex flex-col space-y-2">
                <Link
                  to="/help"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2" />
                    Help
                  </span>
                </Link>
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Admin
                  </span>
                </Link>
                <FeedbackToggle />
                <Link
                  to="/signup"
                  className="block mx-3 py-2 rounded-lg text-center text-white font-medium bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 cs_btn"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}