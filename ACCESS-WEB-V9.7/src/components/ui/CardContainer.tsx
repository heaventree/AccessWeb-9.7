import React from 'react';

interface CardContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Card Container component that provides consistent styling for cards across the application
 * Implements the UI kit styling with rounded corners, proper shadows, and consistent colors
 */
export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  title,
  description,
  className = ''
}) => {
  return (
    <div className={`bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow ${className}`}>
      {title && (
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>
      )}
      
      {description && (
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {description}
          </p>
        </div>
      )}
      
      {children}
    </div>
  );
};

export default CardContainer;