import React from 'react';

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  style?: React.CSSProperties;
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  max, 
  className, 
  barClassName,
  style
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className={`w-full ${className || ''}`}>
      <div 
        className={`${barClassName || 'bg-blue-600'}`} 
        style={{ 
          width: `${percentage}%`, 
          ...style 
        }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      />
    </div>
  );
};