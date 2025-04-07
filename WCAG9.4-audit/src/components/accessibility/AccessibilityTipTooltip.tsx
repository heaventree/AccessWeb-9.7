import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { useAccessibilityTips } from '../../contexts/AccessibilityTipsContext';
import { AccessibilityTip } from '../../data/accessibilityTips';
import { Link } from 'react-router-dom';

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
  const [show, setShow] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [activeTip, setActiveTip] = useState<AccessibilityTip | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Positions
  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-1',
    right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-1',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-1',
    left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-1',
  };

  // Arrow positions
  const arrowClasses = {
    top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent',
    right: 'left-0 top-1/2 transform -translate-y-1/2 -translate-x-full border-t-transparent border-b-transparent border-r-transparent',
    bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-0 top-1/2 transform -translate-y-1/2 translate-x-full border-t-transparent border-b-transparent border-l-transparent',
  };

  useEffect(() => {
    if (tipId) {
      const tip = getTipById(tipId);
      if (tip) {
        setActiveTip(tip);
      }
    } else if (elementType) {
      const tips = getTipsByElement(elementType);
      if (tips && tips.length > 0) {
        // Just use the first tip for this element type
        setActiveTip(tips[0]);
      }
    }
  }, [tipId, elementType, getTipById, getTipsByElement]);

  const handleMouseEnter = () => {
    if (!isEnabled || !activeTip) return;
    
    const id = window.setTimeout(() => {
      setShow(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setShow(false);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  // If tips are disabled or no active tip, just render children
  if (!isEnabled || !activeTip) {
    return <>{children}</>;
  }

  return (
    <div 
      className={`relative inline-block ${className}`} 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
      ref={tooltipRef}
    >
      <div className="relative">
        {children}
        {showIcon && (
          <div className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center bg-blue-500 text-white rounded-full text-xs cursor-help">
            ?
          </div>
        )}
      </div>
      
      {show && (
        <div
          className={`absolute z-50 p-3 text-sm bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs ${positionClasses[position]}`}
          role="tooltip"
          aria-live="polite"
        >
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-blue-600 dark:text-blue-400">{activeTip.title}</h3>
              {activeTip.wcagReference && (
                <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  {activeTip.wcagReference}
                </span>
              )}
            </div>
            
            <p className="text-gray-700 dark:text-gray-300">{activeTip.tip}</p>
            
            {activeTip.learnMoreLink && (
              <Link 
                to={activeTip.learnMoreLink} 
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline self-end mt-1"
              >
                Learn more
              </Link>
            )}
          </div>
          
          <div
            className={`absolute w-0 h-0 border-4 border-gray-200 dark:border-gray-700 ${arrowClasses[position]}`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityTipTooltip;