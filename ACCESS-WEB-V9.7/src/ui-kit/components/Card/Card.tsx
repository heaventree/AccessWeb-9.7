/**
 * ACCESS-WEB UI Kit - Card Component
 * 
 * A flexible card component with multiple variants.
 */

import React, { forwardRef } from 'react';
import { cn, variantClasses } from '../../styles/utils';

type IconType = React.ElementType;

/**
 * Card variants
 */
const cardVariants = {
  variant: {
    primary: 'bg-white dark:bg-gray-800 shadow-sm',
    secondary: 'bg-gray-50 dark:bg-gray-900',
    outline: 'border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-md',
    flat: 'bg-white dark:bg-gray-800',
    feature: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm',
  },
  size: {
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  },
  radius: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  },
};

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: {
    variant?: keyof typeof cardVariants.variant;
    size?: keyof typeof cardVariants.size;
    radius?: keyof typeof cardVariants.radius;
  };
  hoverable?: boolean;
  interactive?: boolean;
  onClick?: () => void;
};

/**
 * Card component
 * 
 * A multi-purpose container component with various styling options.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = {}, hoverable, interactive, ...props }, ref) => {
    const {
      variant: variantType = 'primary',
      size = 'md',
      radius = 'lg',
    } = variant;

    return (
      <div
        ref={ref}
        className={cn(
          'relative',
          variantClasses(cardVariants)({
            variant: variantType,
            size,
            radius,
          }),
          hoverable && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
          interactive && 'cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  compact?: boolean;
};

/**
 * CardHeader component
 * 
 * Container for the card's header content.
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, compact, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5',
          compact ? 'pb-2' : 'pb-4',
          className
        )}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

/**
 * CardTitle component
 * 
 * Title element for the card.
 */
export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-semibold leading-tight text-gray-900 dark:text-white',
          className
        )}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

/**
 * CardDescription component
 * 
 * Description text for the card.
 */
export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          'text-sm text-gray-500 dark:text-gray-400',
          className
        )}
        {...props}
      />
    );
  }
);

CardDescription.displayName = 'CardDescription';

export type CardContentProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
};

/**
 * CardContent component
 * 
 * Container for the card's main content.
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding = 'md', ...props }, ref) => {
    const paddingClass = {
      none: '',
      sm: 'py-2',
      md: 'py-4',
      lg: 'py-6',
    }[padding];

    return (
      <div
        ref={ref}
        className={cn(paddingClass, className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement> & {
  compact?: boolean;
};

/**
 * CardFooter component
 * 
 * Container for the card's footer content.
 */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, compact, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          compact ? 'pt-2' : 'pt-4',
          className
        )}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

export type CardImageProps = React.HTMLAttributes<HTMLDivElement> & {
  src: string;
  alt: string;
  position?: 'top' | 'bottom';
  height?: number | string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  blurDataURL?: string;
};

/**
 * CardImage component
 * 
 * Image component for the card.
 */
export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({ className, src, alt, position = 'top', height = 200, objectFit = 'cover', ...props }, ref) => {
    const positionClassNames = {
      top: 'rounded-t-lg overflow-hidden -mt-6 -mx-6 mb-6',
      bottom: 'rounded-b-lg overflow-hidden -mb-6 -mx-6 mt-6',
    };

    return (
      <div
        ref={ref}
        className={cn(
          positionClassNames[position],
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className={cn(
            'w-full',
            typeof height === 'number' ? `h-[${height}px]` : `h-[${height}]`,
            `object-${objectFit}`
          )}
        />
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';

export type CardFeatureIconProps = React.SVGAttributes<SVGElement> & {
  icon: IconType;
  background?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'none';
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
};

/**
 * CardFeatureIcon component
 * 
 * Icon display for feature cards.
 */
export const CardFeatureIcon = forwardRef<SVGSVGElement, CardFeatureIconProps>(
  ({ className, icon: Icon, background = 'default', size = 'md', rounded = 'md', ...props }, ref) => {
    const backgroundClass = {
      default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100',
      primary: 'bg-[#0fae96]/10 dark:bg-[#0fae96]/20 text-[#0fae96]',
      secondary: 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
      success: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
      warning: 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
      error: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
      info: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
      none: '',
    }[background];

    const sizeClass = {
      sm: 'p-2 w-8 h-8',
      md: 'p-3 w-10 h-10',
      lg: 'p-4 w-12 h-12',
    }[size];

    const roundedClass = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    }[rounded];

    return (
      <div className={cn('inline-flex', backgroundClass, sizeClass, roundedClass, className)}>
        <Icon ref={ref} {...props} className={cn('w-full h-full', props.className)} />
      </div>
    );
  }
);

CardFeatureIcon.displayName = 'CardFeatureIcon';

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