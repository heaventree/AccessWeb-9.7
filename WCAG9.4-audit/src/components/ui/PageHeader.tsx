import React from 'react';
import { cn } from '../../lib/utils';

type PageHeaderProps = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  icon, 
  actions,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between', className)}>
      <div className="flex items-center space-x-3 mb-4 sm:mb-0">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="mt-1 text-gray-500 max-w-2xl">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex space-x-3">{actions}</div>
      )}
    </div>
  );
}