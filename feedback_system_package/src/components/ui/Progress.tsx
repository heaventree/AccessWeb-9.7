import React from 'react';

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  style?: React.CSSProperties;
}

export function Progress({ 
  value, 
  max, 
  className = '', 
  barClassName = '',
  style = {}
}: ProgressProps) {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`w-full bg-gray-200 rounded-full dark:bg-gray-700 ${className}`}>
      <div 
        className={`bg-blue-600 rounded-full ${barClassName}`}
        style={{ 
          width: `${percentage}%`,
          ...style
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      ></div>
    </div>
  );
}

export default Progress;