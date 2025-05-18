import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNavigation, StrapiNavigationAttributes, StrapiMenuItem } from '@/services/strapiService';

interface NavigationProps {
  className?: string;
}

/**
 * Navigation component that renders the menu structure from Strapi CMS
 */
const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [navigation, setNavigation] = useState<StrapiNavigationAttributes | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        setLoading(true);
        const data = await getNavigation();
        setNavigation(data);
      } catch (error) {
        console.error('Error fetching navigation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavigation();
  }, []);

  const renderMenuItem = (item: StrapiMenuItem) => {
    // Determine the URL: either direct URL or from linked page
    const url = item.url || (item.page?.data ? `/${item.page.data.attributes.slug}` : '#');
    
    const linkClasses = item.isButton
      ? 'inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#0fae96] hover:bg-[#0c9a85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] transition-colors'
      : 'text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors px-3 py-2';

    // For items with children, render a dropdown
    if (item.children && item.children.length > 0) {
      return (
        <div key={item.id} className="relative group">
          <button 
            className={`${linkClasses} flex items-center`}
            onClick={() => {}} // For mobile toggling if needed
            aria-expanded="false"
            aria-haspopup="true"
          >
            {item.label}
            <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown menu */}
          <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white dark:bg-slate-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-150">
            <div className="py-1">
              {item.children.map((child) => (
                <Link
                  key={child.id}
                  to={child.url || (child.page?.data ? `/${child.page.data.attributes.slug}` : '#')}
                  target={child.target === '_blank' ? '_blank' : undefined}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Regular menu item
    return (
      <Link
        key={item.id}
        to={url}
        target={item.target === '_blank' ? '_blank' : undefined}
        className={linkClasses}
      >
        {item.icon && <span className="mr-2">{item.icon}</span>}
        {item.label}
      </Link>
    );
  };

  if (loading) {
    return (
      <div className={`flex space-x-4 ${className}`}>
        {/* Loading skeleton */}
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!navigation || !navigation.items || navigation.items.length === 0) {
    return (
      <div className={`flex space-x-4 ${className}`}>
        <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] px-3 py-2">
          Home
        </Link>
      </div>
    );
  }

  // Sort menu items by order property
  const sortedItems = [...navigation.items].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <>
      {/* Desktop navigation */}
      <nav className={`hidden md:flex items-center space-x-4 ${className}`}>
        {sortedItems.map(renderMenuItem)}
      </nav>

      {/* Mobile navigation */}
      <div className="md:hidden">
        <button
          type="button"
          className="text-gray-700 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">Open main menu</span>
          {/* Hamburger icon */}
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="absolute top-16 inset-x-0 z-10 bg-white dark:bg-slate-800 shadow-lg border-t border-gray-200 dark:border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {sortedItems.map((item) => (
                <React.Fragment key={item.id}>
                  <Link
                    to={item.url || (item.page?.data ? `/${item.page.data.attributes.slug}` : '#')}
                    className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  
                  {item.children && item.children.length > 0 && (
                    <div className="pl-4 space-y-1 border-l-2 border-gray-200 dark:border-slate-700 ml-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          to={child.url || (child.page?.data ? `/${child.page.data.attributes.slug}` : '#')}
                          className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;