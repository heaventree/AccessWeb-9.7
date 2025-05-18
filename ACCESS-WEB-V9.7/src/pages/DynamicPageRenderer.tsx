import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageBySlug, StrapiPageAttributes } from '@/services/strapiService';
import DynamicPage from '@/components/strapi/DynamicPage';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * Component that fetches and renders a dynamic page from Strapi based on the URL slug
 */
const DynamicPageRenderer: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<StrapiPageAttributes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const pageData = await getPageBySlug(slug);
        
        if (!pageData) {
          setError('Page not found');
          // Navigate to 404 page after a short delay
          setTimeout(() => {
            navigate('/404', { replace: true });
          }, 2000);
          return;
        }
        
        setPage(pageData);
      } catch (err: any) {
        console.error('Error fetching page:', err);
        setError(err.message || 'An error occurred while fetching the page');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          {error === 'Page not found' ? 'Page not found' : 'Error'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {error === 'Page not found' 
            ? "The page you're looking for doesn't exist or has been moved."
            : "There was an error loading this page. Please try again later."}
        </p>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="px-6 py-2 bg-[#0fae96] hover:bg-[#0c9a85] text-white font-medium rounded-full transition-colors"
        >
          Go to homepage
        </button>
      </div>
    );
  }

  return <DynamicPage page={page!} />;
};

export default DynamicPageRenderer;