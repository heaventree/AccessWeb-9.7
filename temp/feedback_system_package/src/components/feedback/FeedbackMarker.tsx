import React, { useState, useEffect, useRef } from 'react';
import { FeedbackItem, FeedbackCategory, FeedbackStatus } from '../../types/feedback';
import { findElementByPath, getElementPosition } from '../../utils/elementFinder';

interface FeedbackMarkerProps {
  feedback: FeedbackItem;
  onStatusChange?: (id: string, status: FeedbackStatus) => void;
  onDelete?: (id: string) => void;
  showDetails?: boolean;
}

/**
 * A marker that is attached to a specific element on the page and shows feedback information
 */
const FeedbackMarker: React.FC<FeedbackMarkerProps> = ({
  feedback,
  onStatusChange,
  onDelete,
  showDetails = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState(feedback.position);
  const markerRef = useRef<HTMLDivElement>(null);
  
  // Category color mapping
  const getCategoryColor = () => {
    const colorMap: Record<FeedbackCategory, string> = {
      [FeedbackCategory.ACCESSIBILITY]: 'bg-blue-500',
      [FeedbackCategory.USABILITY]: 'bg-purple-500',
      [FeedbackCategory.PERFORMANCE]: 'bg-orange-500',
      [FeedbackCategory.VISUAL]: 'bg-pink-500',
      [FeedbackCategory.FUNCTIONALITY]: 'bg-red-500',
      [FeedbackCategory.CONTENT]: 'bg-green-500',
      [FeedbackCategory.OTHER]: 'bg-gray-500',
    };
    
    return colorMap[feedback.category] || 'bg-gray-500';
  };
  
  // Status color mapping
  const getStatusColor = () => {
    const colorMap: Record<FeedbackStatus, string> = {
      [FeedbackStatus.PENDING]: 'bg-yellow-500',
      [FeedbackStatus.IN_PROGRESS]: 'bg-blue-500',
      [FeedbackStatus.COMPLETED]: 'bg-green-500',
      [FeedbackStatus.REJECTED]: 'bg-red-500',
    };
    
    return colorMap[feedback.status] || 'bg-gray-500';
  };
  
  // Update marker position when element moves or page scrolls
  useEffect(() => {
    const updatePosition = () => {
      const element = findElementByPath(feedback.elementPath);
      if (element) {
        const newPosition = getElementPosition(element);
        setPosition(newPosition);
      }
    };
    
    // Initial position update
    updatePosition();
    
    // Add event listeners
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);
    
    // For elements that might change position due to DOM updates
    const observer = new MutationObserver(updatePosition);
    
    const element = findElementByPath(feedback.elementPath);
    if (element && element.parentElement) {
      observer.observe(element.parentElement, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'] 
      });
    }
    
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      observer.disconnect();
    };
  }, [feedback.elementPath]);
  
  // Close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (markerRef.current && !markerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Handle status change
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as FeedbackStatus;
    if (onStatusChange) {
      onStatusChange(feedback.id, newStatus);
    }
  };
  
  // Handle delete
  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this feedback?')) {
      onDelete(feedback.id);
    }
  };
  
  // Format the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div
      ref={markerRef}
      className="absolute z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Marker dot */}
      <button
        className={`${getCategoryColor()} w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform relative`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Feedback for ${feedback.elementPath}: ${feedback.comment}`}
      >
        <span className="text-white text-xs font-bold">{feedback.id.slice(0, 1)}</span>
        
        {/* Status indicator */}
        <span 
          className={`${getStatusColor()} absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white`}
          aria-hidden="true"
        ></span>
      </button>
      
      {/* Popup Details */}
      {isOpen && (
        <div className="absolute top-8 left-0 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor()} text-white`}>
              {feedback.category}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()} text-white`}>
              {feedback.status}
            </span>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 my-2 whitespace-pre-wrap">
            {feedback.comment}
          </p>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Created: {formatDate(feedback.createdAt)}
            {feedback.updatedAt && (
              <span className="ml-2">Updated: {formatDate(feedback.updatedAt)}</span>
            )}
          </div>
          
          {showDetails && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 p-1 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
              <div title={feedback.elementPath} className="truncate">
                Element: {feedback.elementPath}
              </div>
              <div>
                Page: {feedback.page}
              </div>
            </div>
          )}
          
          {onStatusChange && (
            <div className="flex justify-between items-center mt-2">
              <select
                value={feedback.status}
                onChange={handleStatusChange}
                className="text-xs rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.values(FeedbackStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackMarker;