import React from 'react';
import { StrapiPageAttributes } from '@/services/strapiService';
import HeroSection from './sections/HeroSection';
import FeatureSection from './sections/FeatureSection';
import ContentBlock from './blocks/ContentBlock';
import SEO from './shared/SEO';
import { Helmet } from 'react-helmet-async';

interface DynamicPageProps {
  page: StrapiPageAttributes;
}

/**
 * Renders a dynamic page based on content from Strapi CMS
 */
const DynamicPage: React.FC<DynamicPageProps> = ({ page }) => {
  if (!page) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Page not found</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    );
  }

  const getLayoutClass = () => {
    switch (page.layout) {
      case 'full-width':
        return 'w-full px-0';
      case 'sidebar':
        return 'grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 md:px-6';
      default:
        return 'container mx-auto px-4 md:px-6';
    }
  };

  const renderSection = (section: any, index: number) => {
    const { __component, ...props } = section;

    // Map Strapi component types to React components
    switch (__component) {
      case 'sections.hero-section':
        return <HeroSection key={`section-${index}`} {...props} />;
      case 'sections.feature-section':
        return <FeatureSection key={`section-${index}`} {...props} />;
      case 'blocks.content-block':
        return <ContentBlock key={`section-${index}`} {...props} />;
      default:
        console.warn(`Unknown section type: ${__component}`);
        return null;
    }
  };

  return (
    <>
      {/* Add SEO metadata */}
      {page.seo && <SEO seo={page.seo} />}
      
      {/* If page.seo doesn't exist, add a basic title */}
      {!page.seo && (
        <Helmet>
          <title>{page.title}</title>
        </Helmet>
      )}

      <main className={getLayoutClass()}>
        {page.layout === 'sidebar' && (
          <>
            <div className="lg:col-span-3">
              {page.sections && page.sections.map((section, index) => renderSection(section, index))}
            </div>
            <aside className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Table of Contents</h2>
                <nav className="space-y-2">
                  {page.sections && page.sections
                    .filter(section => section.__component === 'blocks.content-block' && section.title)
                    .map((section, index) => (
                      <a 
                        key={`toc-${index}`}
                        href={`#section-${index}`}
                        className="block text-gray-600 dark:text-gray-300 hover:text-[#0fae96] dark:hover:text-[#5eead4] transition-colors"
                      >
                        {section.title}
                      </a>
                    ))
                  }
                </nav>
              </div>
            </aside>
          </>
        )}
        
        {page.layout !== 'sidebar' && (
          page.sections && page.sections.map((section, index) => renderSection(section, index))
        )}
      </main>
    </>
  );
};

export default DynamicPage;