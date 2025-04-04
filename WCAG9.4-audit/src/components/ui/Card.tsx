import React from 'react';
import { cn } from '../../lib/utils';

type CardProps = {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      'bg-white border border-gray-200 rounded-lg shadow-sm',
      className
    )}>
      {children}
    </div>
  );
}