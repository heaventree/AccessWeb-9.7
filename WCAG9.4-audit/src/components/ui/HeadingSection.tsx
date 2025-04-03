import React from 'react';

interface HeadingSectionProps {
  title: string;
  description?: string;
  className?: string;
}

export const HeadingSection: React.FC<HeadingSectionProps> = ({ 
  title, 
  description, 
  className = '' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
      {description && (
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      )}
    </div>
  );
};