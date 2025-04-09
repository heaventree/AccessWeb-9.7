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
  className = "", 
  barClassName = "", 
  style = {} 
}: ProgressProps) {
  // Calculate the percentage value
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={className} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={`${percentage}% complete`}>
      <div 
        className={barClassName} 
        style={{ 
          width: `${percentage}%`,
          ...style 
        }}
      />
    </div>
  );
}