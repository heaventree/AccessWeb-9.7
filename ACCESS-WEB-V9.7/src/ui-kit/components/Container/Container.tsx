/**
 * ACCESS-WEB UI Kit - Container Component
 * 
 * A flexible container component for controlling width, padding, and structure.
 */

import React, { forwardRef } from 'react';
import { cn, variantClasses } from '../../styles/utils';

/**
 * Container variants
 */
const containerVariants = {
  size: {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
    none: '',
  },
};

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Container size variant - controls max width */
  variant?: {
    size?: keyof typeof containerVariants.size;
  };
  /** Whether container should be centered horizontally */
  centered?: boolean;
  /** Horizontal padding */
  horizontalPadding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Vertical padding */
  verticalPadding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Background color */
  background?: 'none' | 'light' | 'dark' | 'brand' | 'accent';
};

/**
 * Container component
 * 
 * A multi-purpose container component with various styling options
 * for controlling layout and spacing.
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ 
    className, 
    variant = {}, 
    centered = true,
    horizontalPadding = 'md',
    verticalPadding = 'none',
    background = 'none',
    ...props 
  }, ref) => {
    const {
      size = 'xl',
    } = variant;

    const horizontalPaddingClass = {
      none: '',
      sm: 'px-3',
      md: 'px-4 md:px-6',
      lg: 'px-6 md:px-12',
      xl: 'px-8 md:px-16',
    }[horizontalPadding];

    const verticalPaddingClass = {
      none: '',
      sm: 'py-3',
      md: 'py-4 md:py-6',
      lg: 'py-6 md:py-12',
      xl: 'py-8 md:py-16',
    }[verticalPadding];

    const backgroundClass = {
      none: '',
      light: 'bg-gray-50 dark:bg-gray-900',
      dark: 'bg-gray-900 dark:bg-gray-950 text-white',
      brand: 'bg-[#0fae96]/10 dark:bg-[#0fae96]/20',
      accent: 'bg-amber-50 dark:bg-amber-900/20',
    }[background];

    return (
      <div
        ref={ref}
        className={cn(
          containerVariants.size[size],
          centered && 'mx-auto',
          horizontalPaddingClass,
          verticalPaddingClass,
          backgroundClass,
          className
        )}
        {...props}
      />
    );
  }
);

Container.displayName = 'Container';

export type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Background color */
  background?: 'none' | 'light' | 'dark' | 'brand' | 'accent';
  /** Vertical padding */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
};

/**
 * Section component
 * 
 * A component for creating page sections with consistent padding and styling.
 */
export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ className, background = 'none', spacing = 'lg', ...props }, ref) => {
    const backgroundClass = {
      none: '',
      light: 'bg-gray-50 dark:bg-gray-900',
      dark: 'bg-gray-900 dark:bg-gray-950 text-white',
      brand: 'bg-[#0fae96]/10 dark:bg-[#0fae96]/20',
      accent: 'bg-amber-50 dark:bg-amber-900/20',
    }[background];

    const spacingClass = {
      none: '',
      sm: 'py-4 md:py-6',
      md: 'py-6 md:py-8',
      lg: 'py-8 md:py-12',
      xl: 'py-12 md:py-16',
      '2xl': 'py-16 md:py-24',
    }[spacing];

    return (
      <section
        ref={ref}
        className={cn(
          backgroundClass,
          spacingClass,
          className
        )}
        {...props}
      />
    );
  }
);

Section.displayName = 'Section';

export type MainProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Apply top padding to ensure content doesn't sit directly under the header */
  withTopPadding?: boolean;
};

/**
 * Main component
 * 
 * A semantic main element with appropriate styling.
 */
export const Main = forwardRef<HTMLElement, MainProps>(
  ({ className, withTopPadding = false, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          'flex-1',
          withTopPadding && 'pt-16',
          className
        )}
        {...props}
      />
    );
  }
);

Main.displayName = 'Main';