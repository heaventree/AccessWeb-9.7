import React from 'react';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      }
    }
  };
  darkModeBackgroundImage?: {
    data?: {
      attributes: {
        url: string;
        alternativeText?: string;
      }
    }
  };
  textColor?: string;
  darkModeTextColor?: string;
  buttonText?: string;
  buttonLink?: string;
  alignment?: 'left' | 'center' | 'right';
  height?: 'small' | 'medium' | 'large' | 'full';
}

/**
 * Hero section component for Strapi content
 */
const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  darkModeBackgroundImage,
  textColor = '#ffffff',
  darkModeTextColor = '#ffffff',
  buttonText,
  buttonLink,
  alignment = 'center',
  height = 'medium',
}) => {
  // Function to determine if we're in dark mode
  const isDarkMode = () => {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  };

  // Get the background image based on the current mode
  const getBgImage = () => {
    if (isDarkMode() && darkModeBackgroundImage?.data) {
      return darkModeBackgroundImage.data.attributes.url;
    }
    return backgroundImage?.data?.attributes.url || '';
  };

  // Determine text color based on the current mode
  const getTextColor = () => {
    return isDarkMode() ? darkModeTextColor : textColor;
  };

  // Get height class
  const getHeightClass = () => {
    switch (height) {
      case 'small':
        return 'min-h-[300px]';
      case 'medium':
        return 'min-h-[500px]';
      case 'large':
        return 'min-h-[700px]';
      case 'full':
        return 'min-h-screen';
      default:
        return 'min-h-[500px]';
    }
  };

  // Get alignment class
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left':
        return 'text-left items-start';
      case 'right':
        return 'text-right items-end';
      default:
        return 'text-center items-center';
    }
  };

  const bgImage = getBgImage();

  return (
    <section 
      className={`relative flex flex-col justify-center ${getHeightClass()} ${getAlignmentClass()} px-4 md:px-8 py-16 overflow-hidden`}
      style={{
        color: getTextColor(),
        backgroundImage: bgImage ? `url(${bgImage})` : undefined,
        backgroundColor: !bgImage ? '#1f2937' : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      <div className="container mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
            {subtitle}
          </p>
        )}
        
        {buttonText && buttonLink && (
          <Link
            to={buttonLink}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] transition-colors"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroSection;