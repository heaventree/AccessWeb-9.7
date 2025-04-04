import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface CardProps {
  children?: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  hoverable?: boolean;
  bordered?: boolean;
  footer?: ReactNode;
  compact?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
}

/**
 * Card component inspired by Noble UI design patterns
 * 
 * Features:
 * - Consistent padding and border radius
 * - Optional header with title and subtitle
 * - Optional card actions (buttons, links)
 * - Hover effects
 * - Dark mode support
 * - Color variants
 */
export function Card({
  children,
  className = '',
  title,
  subtitle,
  icon,
  action,
  hoverable = false,
  bordered = false,
  footer,
  compact = false,
  variant = 'default'
}: CardProps) {
  // Styles configuration
  const padding = compact ? 'p-3' : 'p-5';
  
  // Variant-specific styles
  const variantStyles = {
    default: '',
    primary: 'border-l-4 border-l-primary-500',
    secondary: 'border-l-4 border-l-secondary-500',
    info: 'border-l-4 border-l-info-500',
    success: 'border-l-4 border-l-success-500',
    warning: 'border-l-4 border-l-warning-500',
    error: 'border-l-4 border-l-error-500'
  };

  return (
    <div 
      className={twMerge(
        'bg-white dark:bg-card-bg dark:border-gray-700 rounded-lg shadow-sm overflow-hidden text-gray-700 dark:text-gray-100',
        bordered && 'border border-gray-200 dark:border-gray-700',
        hoverable && 'transition-shadow hover:shadow-md',
        variantStyles[variant],
        className
      )}
    >
      {/* Card Header */}
      {(title || subtitle || icon || action) && (
        <div className={`${padding} ${children ? 'border-b border-gray-200 dark:border-gray-700' : ''} flex justify-between items-start`}>
          <div className="flex items-center">
            {icon && <div className="mr-3 text-gray-500 dark:text-gray-300 flex-shrink-0">{icon}</div>}
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="ml-4">{action}</div>}
        </div>
      )}

      {/* Card Content */}
      {children && <div className={padding}>{children}</div>}

      {/* Card Footer */}
      {footer && (
        <div className={`${padding} border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-card-bg-secondary`}>
          {footer}
        </div>
      )}
    </div>
  );
}

export interface CardHeaderProps {
  children?: ReactNode;
  className?: string;
  actions?: ReactNode;
}

/**
 * CardHeader component for when you need more complex header structures
 */
export function CardHeader({ children, className = '', actions }: CardHeaderProps) {
  return (
    <div className={twMerge(
      'p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center text-gray-700 dark:text-gray-100',
      className
    )}>
      <div>{children}</div>
      {actions && <div className="ml-4">{actions}</div>}
    </div>
  );
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * CardContent component for consistent content spacing
 */
export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={twMerge('p-5 text-gray-700 dark:text-gray-100', className)}>
      {children}
    </div>
  );
}

export interface CardFooterProps {
  children: ReactNode;
  className?: string;
  divider?: boolean;
}

/**
 * CardFooter component for consistent footer styling
 */
export function CardFooter({ 
  children, 
  className = '', 
  divider = true 
}: CardFooterProps) {
  return (
    <div className={twMerge(
      'p-5 bg-gray-50 dark:bg-card-bg-secondary text-gray-700 dark:text-gray-100',
      divider && 'border-t border-gray-200 dark:border-gray-700',
      className
    )}>
      {children}
    </div>
  );
}