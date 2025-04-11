import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  Menu, 
  X, 
  CheckCircle, 
  Book, 
  Palette, 
  Eye, 
  Activity,
  Zap,
  Image,
  BarChart,
  Shield,
  ShoppingBag,
  Code,
  Briefcase,
  BookOpen,
  Info,
  Wrench,
  Rss,
  Database,
  HelpCircle,
  Home,
  Bell,
  Link as LinkIcon,
  CreditCard,
  Settings,
  Users,
  Sun,
  Moon,
  MessageSquare
} from 'lucide-react';
import { useUIEnhancement } from '../contexts/UIEnhancementContext';
import { useTheme } from '../hooks/useTheme';
import { 
  NavItem, 
  navigationSections, 
  tools, 
  integrations, 
  resources,
  accountItems
} from './NavigationData';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  'check-circle': <CheckCircle className="w-5 h-5" />,
  'book': <Book className="w-5 h-5" />,
  'palette': <Palette className="w-5 h-5" />,
  'eye': <Eye className="w-5 h-5" />,
  'activity': <Activity className="w-5 h-5" />,
  'zap': <Zap className="w-5 h-5" />,
  'image': <Image className="w-5 h-5" />,
  'bar-chart': <BarChart className="w-5 h-5" />,
  'shield': <Shield className="w-5 h-5" />,
  'shopping-bag': <ShoppingBag className="w-5 h-5" />,
  'code': <Code className="w-5 h-5" />,
  'briefcase': <Briefcase className="w-5 h-5" />,
  'book-open': <BookOpen className="w-5 h-5" />,
  'info': <Info className="w-5 h-5" />,
  'tool': <Wrench className="w-5 h-5" />,
  'rss': <Rss className="w-5 h-5" />,
  'database': <Database className="w-5 h-5" />,
  'help-circle': <HelpCircle className="w-5 h-5" />,
  'home': <Home className="w-5 h-5" />,
  'bell': <Bell className="w-5 h-5" />,
  'link': <LinkIcon className="w-5 h-5" />,
  'credit-card': <CreditCard className="w-5 h-5" />,
  'settings': <Settings className="w-5 h-5" />,
  'users': <Users className="w-5 h-5" />,
  'message-square': <MessageSquare className="w-5 h-5" />,
};

export function EnhancedNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();
  const { uiMode } = useUIEnhancement();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    return iconMap[iconName] || null;
  };
  
  return (
    <header className={`w-full z-30 ${
      uiMode === 'enhanced' 
        ? 'bg-white dark:bg-gray-900 shadow-sm dark:shadow-none border-b border-gray-200 dark:border-gray-800'
        : 'bg-white dark:bg-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="Go to homepage">
              <img 
                src="/assets/images/logo.svg" 
                alt="WCAG 9.4 Logo" 
                className="h-8 w-auto dark:hidden" 
              />
              <img 
                src="/assets/images/logo-dark.svg" 
                alt="WCAG 9.4 Logo" 
                className="h-8 w-auto hidden dark:block" 
              />
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                WCAG <span className="text-blue-600 dark:text-blue-400">9.4</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <div className="relative group">
              <button 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname.startsWith('/tools') || pathname === '/checker'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                aria-expanded={false}
              >
                Tools
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white dark:bg-gray-900 shadow-lg rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 w-64 z-50">
                <div className="p-2">
                  {tools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.href || '/'}
                      className={`flex items-start p-2 rounded-md ${
                        pathname === tool.href
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="flex-shrink-0 mr-3 mt-1 text-gray-500 dark:text-gray-400">
                        {getIcon(tool.icon)}
                      </span>
                      <div>
                        <div className="font-medium">{tool.label}</div>
                        {tool.badge && (
                          <span className={`
                            inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1
                            ${tool.badge.variant === 'primary' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                            ${tool.badge.variant === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                          `}>
                            {tool.badge.text}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <button 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname.startsWith('/integrations')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                aria-expanded={false}
              >
                Integrations
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white dark:bg-gray-900 shadow-lg rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 w-64 z-50">
                <div className="p-2">
                  {integrations.map((integration) => (
                    <Link
                      key={integration.id}
                      to={integration.href || '/'}
                      className={`flex items-start p-2 rounded-md ${
                        pathname === integration.href
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="flex-shrink-0 mr-3 mt-1 text-gray-500 dark:text-gray-400">
                        {getIcon(integration.icon)}
                      </span>
                      <div>
                        <div className="font-medium">{integration.label}</div>
                        {integration.badge && (
                          <span className={`
                            inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1
                            ${integration.badge.variant === 'primary' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                            ${integration.badge.variant === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                          `}>
                            {integration.badge.text}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <button 
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  pathname.startsWith('/docs') || pathname.startsWith('/wcag-resources') || 
                  pathname.startsWith('/blog') || pathname.startsWith('/knowledge-base') ||
                  pathname.startsWith('/help')
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                aria-expanded={false}
              >
                Resources
                <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 top-full hidden group-hover:block bg-white dark:bg-gray-900 shadow-lg rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 w-64 z-50">
                <div className="p-2">
                  {resources.map((resource) => (
                    <Link
                      key={resource.id}
                      to={resource.href || '/'}
                      className={`flex items-start p-2 rounded-md ${
                        pathname === resource.href
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="flex-shrink-0 mr-3 mt-1 text-gray-500 dark:text-gray-400">
                        {getIcon(resource.icon)}
                      </span>
                      <div>
                        <div className="font-medium">{resource.label}</div>
                        {resource.badge && (
                          <span className={`
                            inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1
                            ${resource.badge.variant === 'primary' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                            ${resource.badge.variant === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
                          `}>
                            {resource.badge.text}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <a 
              href="https://airtable.com/shrKsYrnJFZ2ny77p" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md"
            >
              Give Feedback
            </a>
            
            <Link 
              to="/pricing" 
              className={`px-3 py-2 text-sm font-medium rounded-md ${
                pathname === '/pricing'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Pricing
            </Link>
          </nav>
          
          {/* Right Section (Auth, Theme, etc) */}
          <div className="flex items-center">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            
            {/* Authentication Links */}
            <div className="hidden md:flex items-center ml-4">
              <Link 
                to="/login" 
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-md"
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-md"
              >
                Sign Up
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="ml-4 md:hidden p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-3 space-y-1">
            <div className="pt-2 pb-4">
              <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 px-2">Tools</h4>
              {tools.map((tool) => (
                <Link
                  key={tool.id}
                  to={tool.href || '/'}
                  className={`flex items-center py-2 px-2 rounded-md ${
                    pathname === tool.href
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-gray-500 dark:text-gray-400">
                    {getIcon(tool.icon)}
                  </span>
                  {tool.label}
                </Link>
              ))}
            </div>
            
            <div className="pt-2 pb-4">
              <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 px-2">Integrations</h4>
              {integrations.map((integration) => (
                <Link
                  key={integration.id}
                  to={integration.href || '/'}
                  className={`flex items-center py-2 px-2 rounded-md ${
                    pathname === integration.href
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-gray-500 dark:text-gray-400">
                    {getIcon(integration.icon)}
                  </span>
                  {integration.label}
                </Link>
              ))}
            </div>
            
            <div className="pt-2 pb-4">
              <h4 className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 px-2">Resources</h4>
              {resources.map((resource) => (
                <Link
                  key={resource.id}
                  to={resource.href || '/'}
                  className={`flex items-center py-2 px-2 rounded-md ${
                    pathname === resource.href
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-gray-500 dark:text-gray-400">
                    {getIcon(resource.icon)}
                  </span>
                  {resource.label}
                </Link>
              ))}
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 py-4">
              <Link 
                to="/pricing"
                className={`flex items-center py-2 px-2 rounded-md ${
                  pathname === '/pricing'
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-3 text-gray-500 dark:text-gray-400">
                  <CreditCard className="w-5 h-5" />
                </span>
                Pricing
              </Link>
              
              <a 
                href="https://airtable.com/shrKsYrnJFZ2ny77p"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center py-2 px-2 rounded-md text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mr-3 text-gray-500 dark:text-gray-400">
                  {getIcon('message-square')}
                </span>
                Give Feedback
              </a>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-800 py-4 flex flex-col space-y-2">
              <Link 
                to="/login"
                className="py-2 px-4 text-center rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link 
                to="/signup"
                className="py-2 px-4 text-center rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}