import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

/**
 * Button component inspired by Noble UI design patterns
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, link, danger, success, warning, info)
 * - Size variations
 * - Loading state
 * - Left and right icons
 * - Full width option
 * - Dark mode support
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isFullWidth = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: 'text-xs px-2.5 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    };

    // Variant classes with dark mode support
    const variantClasses = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white dark:bg-primary-600 dark:hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-secondary-600 hover:bg-secondary-700 text-white dark:bg-secondary-600 dark:hover:bg-secondary-700 focus:ring-secondary-500',
      outline: 'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-500',
      ghost: 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
      link: 'bg-transparent text-primary-600 dark:text-primary-400 hover:underline p-0 focus:ring-0',
      danger: 'bg-error-600 hover:bg-error-700 text-white dark:bg-error-600 dark:hover:bg-error-700 focus:ring-error-500',
      success: 'bg-success-600 hover:bg-success-700 text-white dark:bg-success-600 dark:hover:bg-success-700 focus:ring-success-500',
      warning: 'bg-warning-600 hover:bg-warning-700 text-white dark:bg-warning-600 dark:hover:bg-warning-700 focus:ring-warning-500',
      info: 'bg-info-600 hover:bg-info-700 text-white dark:bg-info-600 dark:hover:bg-info-700 focus:ring-info-500',
    };

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={twMerge(
          // Base styles
          'inline-flex items-center justify-center font-medium rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'transition duration-150 ease-in-out',
          // Disabled state
          isDisabled && 'opacity-60 cursor-not-allowed',
          // Size
          sizeClasses[size],
          // Variant
          variantClasses[variant],
          // Full width
          isFullWidth && 'w-full',
          // Custom classes
          className
        )}
        {...props}
      >
        {isLoading && (
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
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);