import React from 'react';

interface HeadingSectionProps {
  title: string;
  description?: string;
  className?: string;
}

export function HeadingSection({ title, description, className = '' }: HeadingSectionProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
      {description && (
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      )}
    </div>
  );
}