import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

/**
 * A loading spinner component with customizable size and color
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#0fae96',
  className = '',
}) => {
  // Determine size class based on the size prop
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4 border-2';
      case 'large':
        return 'w-12 h-12 border-4';
      default: // medium
        return 'w-8 h-8 border-3';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${getSizeClass()} rounded-full animate-spin border-t-transparent`}
        style={{ borderColor: `${color} transparent transparent transparent` }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingSpinner;