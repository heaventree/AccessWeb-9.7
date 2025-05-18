import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getPages, StrapiPageAttributes } from '@/services/strapiService';
import DynamicPageRenderer from '@/pages/DynamicPageRenderer';

/**
 * Component that loads dynamic routes from Strapi CMS
 */
const StrapiRoutes: React.FC = () => {
  const [pages, setPages] = useState<StrapiPageAttributes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const pagesData = await getPages();
        setPages(pagesData);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  if (loading) {
    return null; // Or show a loading indicator if needed
  }

  return (
    <Routes>
      {pages.map((page) => (
        <Route
          key={page.slug}
          path={`/${page.slug}`}
          element={<DynamicPageRenderer />}
        />
      ))}
    </Routes>
  );
};

export default StrapiRoutes;