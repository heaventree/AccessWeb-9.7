import React from 'react';

interface HeadingSectionProps {
  title: string;
  description?: string;
  className?: string;
}

export function HeadingSection({ title, description, className = '' }: HeadingSectionProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      {description && <p className="mt-1 text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  );
}

export default HeadingSection;