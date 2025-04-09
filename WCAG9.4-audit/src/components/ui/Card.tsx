import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 shadow rounded-lg ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}