import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DynamicPage from '@/components/strapi/DynamicPage';

/**
 * Preview page for Strapi CMS content with dark mode toggle
 */
const PagePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/cms/pages/${id}?preview=true`);
        setPageData(response.data.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching page data:', err);
        setError(err.message || 'Failed to fetch page data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPageData();
    }
  }, [id]);
  
  // Effect to toggle dark mode class on document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Restore original setting when component unmounts
    return () => {
      // Check if the site was originally in dark mode
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (prefersDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
  }, [isDarkMode]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-[#0fae96] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Error Loading Preview</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        <Link
          to={`/admin/content/edit/${id}`}
          className="px-4 py-2 bg-[#0fae96] hover:bg-[#0c9a85] text-white font-medium rounded-full transition-colors"
        >
          Back to Editor
        </Link>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The page you're trying to preview does not exist.</p>
        <Link
          to="/admin/content"
          className="px-4 py-2 bg-[#0fae96] hover:bg-[#0c9a85] text-white font-medium rounded-full transition-colors"
        >
          Back to Content Manager
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Preview controls */}
      <div className="fixed top-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-4 flex flex-col space-y-3">
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Page Preview</h2>
        
        <div className="flex items-center">
          <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">Dark Mode:</span>
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-[#0fae96]' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/admin/content/edit/${id}`}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-full"
          >
            Edit
          </Link>
          <Link
            to="/admin/content"
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-full"
          >
            Back
          </Link>
        </div>
      </div>
      
      {/* Render the dynamic page */}
      <DynamicPage page={pageData} />
    </div>
  );
};

export default PagePreviewPage;