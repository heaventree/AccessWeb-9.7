import React from 'react';

interface ContentBlockProps {
  title?: string;
  content?: string;
  alignment?: 'left' | 'center' | 'right';
  backgroundColor?: string;
  darkModeBackgroundColor?: string;
  textColor?: string;
  darkModeTextColor?: string;
}

/**
 * Content block component for Strapi rich text content
 */
const ContentBlock: React.FC<ContentBlockProps> = ({
  title,
  content,
  alignment = 'left',
  backgroundColor = '#ffffff',
  darkModeBackgroundColor = '#1f2937',
  textColor = '#000000',
  darkModeTextColor = '#ffffff',
}) => {
  // Function to determine if we're in dark mode
  const isDarkMode = () => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  };

  // Get the background color based on the current mode
  const getBgColor = () => {
    return isDarkMode() ? darkModeBackgroundColor : backgroundColor;
  };

  // Get the text color based on the current mode
  const getTextColor = () => {
    return isDarkMode() ? darkModeTextColor : textColor;
  };

  // Get alignment class
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  return (
    <section 
      className={`py-12 px-4 md:px-8 ${getAlignmentClass()}`}
      style={{ 
        backgroundColor: getBgColor(),
        color: getTextColor(),
      }}
      id={title ? `section-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined}
    >
      <div className="container mx-auto">
        {title && (
          <h2 className="text-3xl font-bold mb-6" style={{ color: getTextColor() }}>
            {title}
          </h2>
        )}
        
        {content && (
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  );
};

export default ContentBlock;