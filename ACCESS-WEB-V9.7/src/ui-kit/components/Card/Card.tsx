/**
 * ACCESS-WEB UI Kit - Card Component
 * 
 * A versatile card component for displaying content in a contained, styled box.
 * Cards are essential UI elements used throughout the application for organizing content.
 */

import React, { forwardRef } from 'react';
import { cn } from '../../styles/utils';
import { cardVariants } from '../../styles/variants';
import { createVariants } from '../../styles/utils';

/**
 * Card component props
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom class names */
  className?: string;
  /** Card style variants */
  variant?: {
    /** The visual style variant */
    variant?: keyof typeof cardVariants.variant;
    /** The size of the card padding */
    size?: keyof typeof cardVariants.size;
  };
  /** Whether the card should have a hover effect */
  hoverable?: boolean;
  /** Whether the card should be clickable (adds appropriate styling) */
  clickable?: boolean;
  /** Custom border radius */
  borderRadius?: string;
  /** Renders card with background transparent */
  transparent?: boolean;
  /** Full width card (100% width) */
  fullWidth?: boolean;
  /** Element ID for accessibility and testing */
  id?: string;
}

/**
 * Main Card component
 * 
 * Used for content organization and grouping. Cards can be used for
 * panels, containers, or any content that needs a visual boundary.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = { 
      variant: 'primary',
      size: 'md'
    }, 
    hoverable = false,
    clickable = false,
    transparent = false,
    fullWidth = false,
    borderRadius,
    children, 
    ...props 
  }, ref) => {
    // Generate variant classes
    const getVariantClasses = createVariants(cardVariants);
    const variantClasses = getVariantClasses({ variant });
    
    // Combine all classes
    const cardClasses = cn(
      variantClasses,
      {
        'hover:shadow-md transition-shadow duration-200': hoverable && !clickable,
        'cursor-pointer hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0fae96]': clickable,
        'bg-transparent dark:bg-transparent': transparent,
        'w-full': fullWidth,
      },
      className
    );

    // Style override for borderRadius if provided
    const style = borderRadius 
      ? { ...props.style, borderRadius } 
      : props.style;

    return (
      <div
        ref={ref}
        className={cardClasses}
        {...props}
        style={style}
        tabIndex={clickable ? 0 : undefined}
        role={clickable ? 'button' : undefined}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * Card Header component props
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Card Header component for displaying title and actions
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

/**
 * Card Title component props
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

/**
 * Card Title component for card headings
 */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as = 'h3', children, ...props }, ref) => {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={cn(
          'text-xl font-semibold text-gray-900 dark:text-white',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

/**
 * Card Description component props
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

/**
 * Card Description component for secondary text
 */
export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm text-gray-500 dark:text-gray-400',
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

/**
 * Card Content component props
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  noPadding?: boolean;
}

/**
 * Card Content component for main content area
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, noPadding = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          { 'p-4': !noPadding },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

/**
 * Card Footer component props
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Card Footer component for actions and footnotes
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-row items-center justify-end border-t border-gray-200 dark:border-gray-700 p-4',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

/**
 * Card Image component props
 */
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  aspectRatio?: '1:1' | '4:3' | '16:9' | '21:9';
  position?: 'top' | 'bottom';
  overlay?: React.ReactNode;
}

/**
 * Card Image component for media in cards
 */
export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, src, alt, aspectRatio = '16:9', position = 'top', overlay, ...props }, ref) => {
    // Calculate aspect ratio
    const aspectRatioClass = {
      '1:1': 'aspect-square',
      '4:3': 'aspect-[4/3]',
      '16:9': 'aspect-[16/9]',
      '21:9': 'aspect-[21/9]',
    }[aspectRatio];
    
    // Border radius classes based on position
    const borderRadiusClass = {
      'top': 'rounded-t-xl',
      'bottom': 'rounded-b-xl',
    }[position];
    
    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden w-full', 
          aspectRatioClass,
          borderRadiusClass,
          className
        )}
      >
        <img
          src={src}
          alt={alt}
          className="object-cover w-full h-full"
          {...props}
        />
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 w-full">{overlay}</div>
          </div>
        )}
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';

/**
 * Card.FeatureIcon component props
 */
export interface CardFeatureIconProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  icon: React.ReactNode;
  iconClassName?: string;
  background?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

/**
 * Card.FeatureIcon component for feature cards with icon
 */
export const CardFeatureIcon = forwardRef<HTMLDivElement, CardFeatureIconProps>(
  ({ className, icon, iconClassName, background = 'default', ...props }, ref) => {
    const backgroundClasses = {
      default: 'bg-gray-100 dark:bg-gray-800',
      primary: 'bg-[#0fae96]/10 dark:bg-[#0fae96]/20',
      secondary: 'bg-gray-100 dark:bg-gray-800',
      success: 'bg-green-100 dark:bg-green-900/30',
      warning: 'bg-amber-100 dark:bg-amber-900/30',
      error: 'bg-red-100 dark:bg-red-900/30',
      info: 'bg-blue-100 dark:bg-blue-900/30',
    }[background];
    
    return (
      <div
        ref={ref}
        className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
          backgroundClasses,
          className
        )}
        {...props}
      >
        <div className={cn('text-[#0fae96] w-6 h-6', iconClassName)}>{icon}</div>
      </div>
    );
  }
);

CardFeatureIcon.displayName = 'CardFeatureIcon';

// Export all components
export { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
  CardFeatureIcon
};