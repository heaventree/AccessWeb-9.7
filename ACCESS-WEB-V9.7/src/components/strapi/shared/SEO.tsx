import React from 'react';
import { Helmet } from 'react-helmet-async';
import { StrapiSEO } from '@/services/strapiService';

interface SEOProps {
  seo: StrapiSEO;
}

/**
 * SEO component for setting meta tags based on Strapi content
 */
const SEO: React.FC<SEOProps> = ({ seo }) => {
  const {
    metaTitle,
    metaDescription,
    keywords,
    metaRobots,
    metaViewport,
    canonicalURL,
    metaImage,
    structuredData,
  } = seo;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{metaTitle}</title>
      {metaDescription && <meta name="description" content={metaDescription} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {metaRobots && <meta name="robots" content={metaRobots} />}
      {metaViewport && <meta name="viewport" content={metaViewport} />}
      {canonicalURL && <link rel="canonical" href={canonicalURL} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      {metaImage?.data && (
        <>
          <meta property="og:image" content={metaImage.data.attributes.url} />
          <meta property="og:image:width" content={metaImage.data.attributes.width.toString()} />
          <meta property="og:image:height" content={metaImage.data.attributes.height.toString()} />
          {metaImage.data.attributes.alternativeText && (
            <meta property="og:image:alt" content={metaImage.data.attributes.alternativeText} />
          )}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
      {metaImage?.data && (
        <>
          <meta name="twitter:image" content={metaImage.data.attributes.url} />
          {metaImage.data.attributes.alternativeText && (
            <meta name="twitter:image:alt" content={metaImage.data.attributes.alternativeText} />
          )}
        </>
      )}

      {/* Schema.org structured data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;