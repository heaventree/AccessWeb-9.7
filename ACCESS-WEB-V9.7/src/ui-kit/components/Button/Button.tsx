/**
 * ACCESS-WEB UI Kit - Button Component
 * 
 * A flexible button component with multiple variants.
 */

import React, { forwardRef } from 'react';
import { cn, variantClasses } from '../../styles/utils';

/**
 * Button variants
 */
const buttonVariants = {
  variant: {
    primary: 'bg-gradient-to-r from-[#0fae96] to-teal-500 hover:from-teal-500 hover:to-[#0fae96] text-white shadow-sm hover:shadow',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100',
    outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    link: 'text-[#0fae96] hover:underline p-0 h-auto',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  },
  size: {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
    xl: 'text-lg px-6 py-3',
  },
  shape: {
    square: 'rounded-none',
    rounded: 'rounded-md',
    pill: 'rounded-full',
  },
  width: {
    auto: 'w-auto',
    full: 'w-full',
    fit: 'w-fit',
  },
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: {
    variant?: keyof typeof buttonVariants.variant;
    size?: keyof typeof buttonVariants.size;
    shape?: keyof typeof buttonVariants.shape;
    width?: keyof typeof buttonVariants.width;
  };
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  as?: React.ElementType;
};

/**
 * Button component
 * 
 * A multi-purpose button component with various styling options.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = {}, 
    icon, 
    iconPosition = 'left', 
    loading = false, 
    disabled = false, 
    children, 
    as: Component = 'button',
    ...props 
  }, ref) => {
    const {
      variant: variantType = 'primary',
      size = 'md',
      shape = 'rounded',
      width = 'auto',
    } = variant;

    const isDisabled = disabled || loading;

    return (
      <Component
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed',
          variantClasses(buttonVariants)({
            variant: variantType,
            size,
            shape,
            width,
          }),
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {icon && iconPosition === 'left' && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </Component>
    );
  }
);

Button.displayName = 'Button';

export type IconButtonProps = Omit<ButtonProps, 'iconPosition'> & {
  'aria-label': string;
  size?: keyof typeof iconButtonSizes;
};

const iconButtonSizes = {
  xs: 'p-1',
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
  xl: 'p-3',
};

/**
 * IconButton component
 * 
 * A button component optimized for displaying only an icon.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, size = 'md', 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          iconButtonSizes[size],
          className
        )}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = 'IconButton';

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
};

/**
 * ButtonGroup component
 * 
 * A component for grouping related buttons.
 */
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ children, orientation = 'horizontal', spacing = 'md', className, ...props }, ref) => {
    const orientationClassNames = {
      horizontal: 'flex-row',
      vertical: 'flex-col',
    };

    const spacingClassNames = {
      none: orientation === 'horizontal' ? '-ml-px' : '-mt-px',
      sm: orientation === 'horizontal' ? 'space-x-1' : 'space-y-1',
      md: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
      lg: orientation === 'horizontal' ? 'space-x-3' : 'space-y-3',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          orientationClassNames[orientation],
          spacing !== 'none' && spacingClassNames[spacing],
          className
        )}
        {...props}
      >
        {spacing === 'none'
          ? React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) return child;
              
              return React.cloneElement(child, {
                className: cn(
                  child.props.className,
                  'rounded-none first:rounded-l-md last:rounded-r-md',
                  orientation === 'vertical' && 'first:rounded-t-md first:rounded-l-none last:rounded-b-md last:rounded-r-none'
                ),
              });
            })
          : children}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';