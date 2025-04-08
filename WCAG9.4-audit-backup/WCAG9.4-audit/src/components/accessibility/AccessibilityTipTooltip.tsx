import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { useAccessibilityTips } from '../../contexts/AccessibilityTipsContext';
import { Info } from 'lucide-react';
import { AccessibilityTip } from '../../data/accessibilityTips';

interface AccessibilityTipTooltipProps {
  children: ReactNode;
  tipId?: string;
  elementType?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  showIcon?: boolean;
  className?: string;
}

export const AccessibilityTipTooltip: React.FC<AccessibilityTipTooltipProps> = ({
  children,
  tipId,
  elementType,
  position = 'top',
  delay = 300,
  showIcon = true,
  className = '',
}) => {
  const { isEnabled, getTipById, getTipsByElement } = useAccessibilityTips();
  const [isVisible, setIsVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<AccessibilityTip | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Determine which tip to display
    if (tipId) {
      const tip = getTipById(tipId);
      if (tip) setCurrentTip(tip);
    } else if (elementType) {
      const tips = getTipsByElement(elementType);
      if (tips.length > 0) setCurrentTip(tips[0]);
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [tipId, elementType, getTipById, getTipsByElement]);
  
  useEffect(() => {
    // Add click outside listener to close tooltip
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleMouseEnter = () => {
    if (!isEnabled || !currentTip) return;
    
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };
  
  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Use a small delay before hiding to allow moving to the tooltip
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 100);
  };
  
  const handleTooltipMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const handleTooltipMouseLeave = () => {
    setIsVisible(false);
  };
  
  if (!isEnabled || !currentTip) {
    return <>{children}</>;
  }
  
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
    >
      {children}
      
      {showIcon && (
        <div className="accessibility-tip-indicator" aria-hidden="true">
          <Info className="w-4 h-4" />
        </div>
      )}
      
      {isVisible && (
        <div
          role="tooltip"
          ref={tooltipRef}
          className={`absolute z-50 w-72 p-3 text-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-200 dark:border-blue-800 ${positionClasses[position]}`}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
        >
          <div className="absolute w-0 h-0 border-4 border-solid"></div>
          <div className="font-medium text-blue-600 dark:text-blue-400 mb-1">
            {currentTip.title}
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {currentTip.tip}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentTip.wcagReference}
            </span>
            {currentTip.learnMoreLink && (
              <a
                href={currentTip.learnMoreLink}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Learn more
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityTipTooltip;