import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNavigation, StrapiMenuItem } from '@/services/strapiService';

/**
 * Main navigation component that fetches and renders the site navigation from Strapi
 */
const MainNavigation: React.FC = () => {
  const [items, setItems] = useState<StrapiMenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNavigation = async () => {
      try {
        setIsLoading(true);
        const navigation = await getNavigation();
        
        if (navigation && navigation.items) {
          setItems(navigation.items);
        } else {
          // Fallback to default navigation if not found in Strapi
          setItems([
            { id: 1, label: 'Home', url: '/' },
            { id: 2, label: 'Tools', url: '/tools' },
            { id: 3, label: 'Dashboard', url: '/dashboard' },
          ]);
        }
      } catch (err: any) {
        console.error('Error fetching navigation:', err);
        setError(err.message);
        
        // Fallback to default navigation on error
        setItems([
          { id: 1, label: 'Home', url: '/' },
          { id: 2, label: 'Tools', url: '/tools' },
          { id: 3, label: 'Dashboard', url: '/dashboard' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNavigation();
  }, []);

  // Recursive function to render menu items
  const renderMenuItem = (item: StrapiMenuItem) => {
    // Get the URL either from direct URL or from related page slug
    const url = item.url || (item.page?.data ? `/${item.page.data.attributes.slug}` : '#');
    
    // If item has children, render a dropdown
    if (item.children && item.children.length > 0) {
      return (
        <div key={item.id} className="relative group">
          <button 
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-[#0fae96] dark:hover:text-[#5eead4] focus:outline-none"
            aria-expanded="false"
            aria-haspopup="true"
          >
            {item.label}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="absolute left-0 hidden pt-2 group-hover:block z-10">
            <div className="bg-white dark:bg-slate-800 shadow-lg rounded-xl p-2 min-w-[200px] border border-gray-200 dark:border-slate-700">
              {item.children.map(child => (
                <Link
                  key={child.id}
                  to={child.url || (child.page?.data ? `/${child.page.data.attributes.slug}` : '#')}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
                  target={child.target === '_blank' ? '_blank' : undefined}
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
        className={`px-4 py-2 ${item.isButton 
          ? 'bg-[#0fae96] hover:bg-[#0c9a85] text-white font-medium rounded-full' 
          : 'text-gray-700 dark:text-gray-200 hover:text-[#0fae96] dark:hover:text-[#5eead4]'}`}
        target={item.target === '_blank' ? '_blank' : undefined}
      >
        {item.icon && (
          <span className="mr-2">{item.icon}</span>
        )}
        {item.label}
      </Link>
    );
  };

  if (isLoading) {
    return (
      <div className="flex space-x-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Navigation error:', error);
    // On error, render a simple navigation
    return (
      <div className="flex space-x-4">
        <Link to="/" className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-[#0fae96] dark:hover:text-[#5eead4]">
          Home
        </Link>
        <Link to="/tools" className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-[#0fae96] dark:hover:text-[#5eead4]">
          Tools
        </Link>
        <Link to="/dashboard" className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:text-[#0fae96] dark:hover:text-[#5eead4]">
          Dashboard
        </Link>
      </div>
    );
  }

  return (
    <nav className="flex space-x-2">
      {items.sort((a, b) => (a.order || 0) - (b.order || 0)).map(renderMenuItem)}
    </nav>
  );
};

export default MainNavigation;