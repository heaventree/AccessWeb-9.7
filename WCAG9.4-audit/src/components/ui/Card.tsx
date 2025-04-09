import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  bordered?: boolean;
}

export function Card({ 
  children, 
  className = "", 
  onClick,
  title,
  subtitle,
  icon,
  action,
  bordered = false
}: CardProps) {
  const hasHeader = title || subtitle || icon || action;
  
  return (
    <div 
      className={`bg-white dark:bg-gray-800 shadow rounded-lg ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''} ${className}`}
      onClick={onClick}
    >
      {hasHeader && (
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            {icon && <span className="mr-2 text-primary-500">{icon}</span>}
            <div>
              {title && <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}