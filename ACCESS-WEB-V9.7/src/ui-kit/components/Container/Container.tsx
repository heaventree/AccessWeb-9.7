/**
 * ACCESS-WEB UI Kit - Container Component
 * 
 * A responsive container component that handles content width constraints
 * and padding across different viewport sizes.
 */

import React, { forwardRef } from 'react';
import { cn } from '../../styles/utils';
import { containerVariants } from '../../styles/variants';
import { createVariants } from '../../styles/utils';

/**
 * Container component props
 */
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Additional CSS classes */
  className?: string;
  /** Container style variants */
  variant?: {
    /** The width constraint */
    size?: keyof typeof containerVariants.size;
    /** The container layout variant */
    variant?: keyof typeof containerVariants.variant;
  };
  /** Whether to center the container horizontally */
  centered?: boolean;
  /** Whether to add default vertical padding */
  verticalPadding?: boolean | 'sm' | 'md' | 'lg';
  /** Element to render as (defaults to div) */
  as?: React.ElementType;
  /** Optional background color/styling */
  background?: 'none' | 'light' | 'dark' | 'primary' | 'secondary' | 'accent';
}

/**
 * Container component
 * 
 * Used for providing consistent width constraints and padding
 * to content sections throughout the application.
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({
    className,
    variant = {
      size: 'xl',
      variant: 'default',
    },
    centered = true,
    verticalPadding = false,
    as: Component = 'div',
    background = 'none',
    children,
    ...props
  }, ref) => {
    // Get classes from variant
    const getVariantClasses = createVariants(containerVariants);
    const variantClasses = getVariantClasses({ variant });
    
    // Apply vertical padding based on size
    const verticalPaddingClasses = 
      verticalPadding === true ? 'py-8 md:py-12 lg:py-16' :
      verticalPadding === 'sm' ? 'py-4 md:py-6' :
      verticalPadding === 'md' ? 'py-8 md:py-10' :
      verticalPadding === 'lg' ? 'py-12 md:py-16 lg:py-20' :
      '';
    
    // Background styling
    const backgroundClasses = {
      'none': '',
      'light': 'bg-gray-50 dark:bg-gray-900',
      'dark': 'bg-gray-900 dark:bg-gray-800 text-white',
      'primary': 'bg-[#0fae96]/10 dark:bg-[#0fae96]/20',
      'secondary': 'bg-gray-100 dark:bg-gray-800',
      'accent': 'bg-gradient-to-r from-[#0fae96]/5 to-blue-500/5 dark:from-[#0fae96]/10 dark:to-blue-500/10',
    }[background];

    return (
      <Component
        ref={ref}
        className={cn(
          variantClasses,
          verticalPaddingClasses,
          backgroundClasses,
          { 'mx-auto': centered },
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Container.displayName = 'Container';

/**
 * Section component props
 */
export interface SectionProps extends ContainerProps {
  /** Section ID for navigation/linking */
  id?: string;
  /** Enable vertical spacing between direct children */
  spaceY?: boolean | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Section component
 * 
 * Used for creating page sections with consistent spacing.
 * Extends Container with additional spacing controls.
 */
export const Section = forwardRef<HTMLElement, SectionProps>(
  ({
    className,
    id,
    variant = {
      size: 'xl',
      variant: 'default',
    },
    verticalPadding = true,
    spaceY = false,
    children,
    ...props
  }, ref) => {
    // Calculate spacing between children
    const spaceYClasses = 
      spaceY === true ? 'space-y-8 md:space-y-12' :
      spaceY === 'sm' ? 'space-y-4 md:space-y-6' :
      spaceY === 'md' ? 'space-y-8 md:space-y-10' :
      spaceY === 'lg' ? 'space-y-12 md:space-y-16' :
      spaceY === 'xl' ? 'space-y-16 md:space-y-24' :
      '';

    return (
      <Container
        as="section"
        ref={ref}
        id={id}
        variant={variant}
        verticalPadding={verticalPadding}
        className={cn(spaceYClasses, className)}
        {...props}
      >
        {children}
      </Container>
    );
  }
);

Section.displayName = 'Section';

/**
 * Main component props
 */
export interface MainProps extends React.HTMLAttributes<HTMLElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Main component
 * 
 * Represents the main content area of the page.
 */
export const Main = forwardRef<HTMLElement, MainProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn('flex-1', className)}
        {...props}
      >
        {children}
      </main>
    );
  }
);

Main.displayName = 'Main';

export { Container, Section, Main };