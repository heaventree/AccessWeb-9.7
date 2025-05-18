import React from 'react';
import { Link } from 'react-router-dom';

interface FeatureItem {
  id: number;
  title: string;
  description?: string;
  icon?: string;
  image?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      }
    }
  };
  linkText?: string;
  linkUrl?: string;
}

interface FeatureSectionProps {
  title?: string;
  description?: string;
  backgroundColor?: string;
  darkModeBackgroundColor?: string;
  features: FeatureItem[];
  columns?: '1' | '2' | '3' | '4';
}

/**
 * Feature section component for Strapi content
 */
const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  backgroundColor = '#ffffff',
  darkModeBackgroundColor = '#1f2937',
  features = [],
  columns = '3',
}) => {
  // Function to determine if we're in dark mode
  const isDarkMode = () => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  };

  // Get column class based on the columns prop
  const getColumnClass = () => {
    switch (columns) {
      case '1':
        return 'grid-cols-1';
      case '2':
        return 'grid-cols-1 md:grid-cols-2';
      case '3':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case '4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };
  
  // Get the background color based on the current mode
  const getBgColor = () => {
    return isDarkMode() ? darkModeBackgroundColor : backgroundColor;
  };

  // Helper to render an icon
  const renderIcon = (icon?: string) => {
    if (!icon) return null;
    
    // This is a simplified approach. In a real implementation, you might want to use a proper icon library
    // or render SVG icons based on the icon name.
    return (
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#0fae96] bg-opacity-10 mb-4">
        <span className="text-[#0fae96] text-xl">{icon}</span>
      </div>
    );
  };

  return (
    <section 
      className="py-16 px-4 md:px-8"
      style={{ backgroundColor: getBgColor() }}
    >
      <div className="container mx-auto">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {title}
              </h2>
            )}
            
            {description && (
              <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                {description}
              </p>
            )}
          </div>
        )}
        
        {features.length > 0 && (
          <div className={`grid ${getColumnClass()} gap-8`}>
            {features.map((feature) => (
              <div 
                key={feature.id}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                {feature.image?.data && (
                  <img
                    src={feature.image.data.attributes.url}
                    alt={feature.image.data.attributes.alternativeText || feature.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                
                {!feature.image?.data && renderIcon(feature.icon)}
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                {feature.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {feature.description}
                  </p>
                )}
                
                {feature.linkText && feature.linkUrl && (
                  <Link
                    to={feature.linkUrl}
                    className="text-[#0fae96] hover:text-[#0c9a85] dark:text-[#5eead4] dark:hover:text-[#4fd0bd] inline-flex items-center font-medium"
                  >
                    {feature.linkText}
                    <svg className="ml-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeatureSection;