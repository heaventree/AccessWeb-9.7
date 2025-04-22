/**
 * ACCESS-WEB UI Kit - Button Component
 * 
 * A versatile button component with multiple variants and sizes.
 * Used for all interactive actions in the application.
 */

import React, { forwardRef } from 'react';
import { cn } from '../../styles/utils';
import { buttonVariants } from '../../styles/variants';
import { createVariants } from '../../styles/utils';

// Icons for loading and different button states
const LoadingSpinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

/**
 * Button component props
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Additional CSS classes */
  className?: string;
  /** Button style variants */
  variant?: {
    /** The visual style variant */
    variant?: keyof typeof buttonVariants.variant;
    /** The size of the button */
    size?: keyof typeof buttonVariants.size;
    /** The shape of the button */
    shape?: keyof typeof buttonVariants.shape;
  };
  /** Whether the button displays a loading spinner */
  isLoading?: boolean;
  /** The loading text to display when isLoading is true */
  loadingText?: string;
  /** Whether the button is full width */
  fullWidth?: boolean;
  /** Optional left icon */
  leftIcon?: React.ReactNode;
  /** Optional right icon */
  rightIcon?: React.ReactNode;
  /** Whether the button has elevated/drop shadow style */
  elevated?: boolean;
  /** Whether the button is active (pressed) */
  active?: boolean;
  /** Whether the button is in a success state */
  success?: boolean;
  /** Whether to render an unstyled button with only basic behaviors */
  unstyled?: boolean;
}

/**
 * Main Button component
 * 
 * Used for all interactive actions in the application.
 * Supports multiple variants, sizes, and states.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = {
      variant: 'primary',
      size: 'md',
      shape: 'default',
    },
    isLoading = false,
    loadingText,
    fullWidth = false,
    leftIcon,
    rightIcon,
    elevated = false,
    active = false,
    success = false,
    unstyled = false,
    children,
    disabled,
    type = 'button',
    ...props
  }, ref) => {
    // Get classes based on variants
    const getVariantClasses = createVariants(buttonVariants);
    const variantClasses = !unstyled ? getVariantClasses({ variant }) : '';

    // Base classes that apply to all variants 
    const baseClasses = !unstyled
      ? cn(
          'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0fae96] disabled:opacity-50 disabled:pointer-events-none',
          {
            'w-full': fullWidth,
            'shadow-md': elevated,
            'translate-y-0.5': active && !disabled && !isLoading,
            'bg-green-600 hover:bg-green-700 text-white': success && !disabled,
          }
        )
      : '';

    // Combine all classes
    const buttonClasses = cn(baseClasses, variantClasses, className);

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {isLoading && loadingText ? loadingText : children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * IconButton component props
 */
export interface IconButtonProps extends ButtonProps {
  /** The icon to display */
  icon: React.ReactNode;
  /** Accessible label for screen readers */
  'aria-label': string;
}

/**
 * IconButton component for icon-only buttons
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, variant = { size: 'md' }, 'aria-label': ariaLabel, ...props }, ref) => {
    // Default to square or circular aspect ratio for icon buttons
    const sizeToIconClass = {
      xs: 'w-6 h-6 p-0.5',
      sm: 'w-8 h-8 p-1',
      md: 'w-10 h-10 p-1.5',
      lg: 'w-12 h-12 p-2',
      xl: 'w-14 h-14 p-2.5',
    }[variant.size || 'md'];

    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(sizeToIconClass, 'flex items-center justify-center', className)}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

/**
 * ButtonGroup component props
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Child buttons */
  children: React.ReactNode;
  /** Whether buttons should be attached/joined */
  attached?: boolean;
  /** Space between unattached buttons */
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  /** Orientation of the button group */
  orientation?: 'horizontal' | 'vertical';
  /** Render as a different element */
  as?: React.ElementType;
}

/**
 * ButtonGroup component for grouping related buttons
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({
    children,
    attached = false,
    spacing = 'sm',
    orientation = 'horizontal',
    as: Component = 'div',
    className,
    ...props
  }, ref) => {
    // Spacing between unattached buttons
    const spacingClasses = {
      xs: orientation === 'horizontal' ? 'space-x-1' : 'space-y-1',
      sm: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
      md: orientation === 'horizontal' ? 'space-x-3' : 'space-y-3',
      lg: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    }[spacing];

    // Attached buttons need special styling
    const attachedClasses = attached
      ? orientation === 'horizontal'
        ? '[&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:-ml-px'
        : '[&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)]:-mt-px'
      : spacingClasses;

    // Orientation classes
    const flexClasses = orientation === 'horizontal' ? 'flex flex-row' : 'flex flex-col';

    return (
      <Component
        ref={ref}
        className={cn(
          flexClasses,
          attachedClasses,
          'inline-flex',
          className
        )}
        role="group"
        {...props}
      >
        {children}
      </Component>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

export { Button, IconButton, ButtonGroup };