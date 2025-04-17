import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { FeedbackCategory, FeedbackStatus, FeedbackItem } from '../types/feedback';
import { useFeedbackSystem } from '../hooks/useFeedbackSystem';
import { getElementPath, findElementByPath, getElementPosition, highlightElement } from '../utils/elementFinder';
import FeedbackMarker from './feedback/FeedbackMarker';

interface SimpleFeedbackSystemProps {
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left' | 'middle-right';
  defaultCategory?: FeedbackCategory;
  showStatuses?: boolean;
}

/**
 * A simple feedback system that allows users to click on elements and leave feedback
 */
const SimpleFeedbackSystem: React.FC<SimpleFeedbackSystemProps> = ({
  position = 'middle-right', // Default position
  defaultCategory = FeedbackCategory.USABILITY,
  showStatuses = true,
}) => {
  const location = useLocation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [showFeedbackItems, setShowFeedbackItems] = useState(true);
  
  const {
    feedbackItems,
    isActive,
    selectedElement,
    currentCategory,
    setSelectedElement,
    setCurrentCategory,
    toggleFeedbackMode,
    addFeedbackItem,
    updateFeedbackStatus,
    removeFeedbackItem,
    getFeedbackItemsForPage
  } = useFeedbackSystem();
  
  // Initialize with default category
  useEffect(() => {
    setCurrentCategory(defaultCategory);
  }, [defaultCategory, setCurrentCategory]);
  
  // Get current page path for filtering feedback items
  const currentPage = location.pathname;
  const currentPageFeedbackItems = getFeedbackItemsForPage(currentPage);
  
  // Setup element hover listener when feedback mode is active
  useEffect(() => {
    if (!isActive) {
      setHoveredElement(null);
      return;
    }
    
    // Track mouse movement to highlight elements
    const handleMouseMove = (e: MouseEvent) => {
      if (selectedElement) return; // Don't track if already selected
      
      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      
      // Skip if hovering the feedback system itself
      if (element?.closest('.feedback-system-container')) {
        setHoveredElement(null);
        return;
      }
      
      setHoveredElement(element);
      
      // Add highlight to hovered element
      if (element && element !== hoveredElement) {
        // Remove previous highlight
        if (hoveredElement) {
          hoveredElement.style.outline = '';
          hoveredElement.style.outlineOffset = '';
        }
        
        // Add new highlight
        element.style.outline = '2px dashed rgba(59, 130, 246, 0.5)';
        element.style.outlineOffset = '2px';
      }
    };
    
    // Handle clicks on elements to select them
    const handleElementClick = (e: MouseEvent) => {
      if (!isActive) return;
      
      // Prevent bubbling and default behavior
      e.preventDefault();
      e.stopPropagation();
      
      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      
      // Skip if clicking the feedback system itself
      if (element?.closest('.feedback-system-container')) return;
      
      // Select the clicked element
      setSelectedElement(element);
      setIsFormOpen(true);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleElementClick, { capture: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleElementClick, { capture: true });
      
      // Clean up any lingering highlight
      if (hoveredElement) {
        hoveredElement.style.outline = '';
        hoveredElement.style.outlineOffset = '';
      }
    };
  }, [isActive, hoveredElement, selectedElement, setSelectedElement]);
  
  // Submit feedback
  const handleSubmitFeedback = useCallback(() => {
    if (!selectedElement || !comment.trim()) return;
    
    const elementPath = getElementPath(selectedElement);
    const elementPosition = getElementPosition(selectedElement);
    
    const newFeedback = addFeedbackItem({
      elementPath,
      position: elementPosition,
      comment,
      category: currentCategory,
      page: currentPage
    });
    
    // Clear form
    setComment('');
    setIsFormOpen(false);
    setSelectedElement(null);
    
    // Keep feedback mode active but allow user to continue using the application
    toggleFeedbackMode();
  }, [
    selectedElement, 
    comment, 
    addFeedbackItem, 
    currentCategory, 
    currentPage, 
    setSelectedElement, 
    toggleFeedbackMode
  ]);
  
  // Cancel feedback
  const handleCancelFeedback = useCallback(() => {
    setComment('');
    setIsFormOpen(false);
    setSelectedElement(null);
    toggleFeedbackMode();
  }, [setSelectedElement, toggleFeedbackMode]);
  
  // Determine position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'middle-right':
        return 'top-1/2 -translate-y-1/2 right-4';
      default:
        return 'top-1/2 -translate-y-1/2 right-4';
    }
  };
  
  return (
    <>
      {/* Floating action button */}
      <div 
        className={`fixed ${getPositionClasses()} z-50 feedback-system-container`}
      >
        <button
          onClick={toggleFeedbackMode}
          className={`${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} 
            rounded-full w-12 h-12 flex items-center justify-center shadow-lg text-white transition-colors`}
          aria-label={isActive ? 'Cancel feedback mode' : 'Provide feedback'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
            />
          </svg>
        </button>
        
        {/* Show/hide feedback markers toggle */}
        <button
          onClick={() => setShowFeedbackItems(!showFeedbackItems)}
          className={`mt-2 ${showFeedbackItems ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'} 
            rounded-full w-10 h-10 flex items-center justify-center shadow-lg text-white transition-colors`}
          aria-label={showFeedbackItems ? 'Hide feedback markers' : 'Show feedback markers'}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={showFeedbackItems 
                ? "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
              } 
            />
          </svg>
        </button>
      </div>
      
      {/* Feedback form */}
      {isFormOpen && selectedElement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 feedback-system-container">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Provide Feedback
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value as FeedbackCategory)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                {Object.values(FeedbackCategory).map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={4}
                placeholder="Describe the issue or suggestion..."
              ></textarea>
            </div>
            
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
              <div title={getElementPath(selectedElement)} className="truncate">
                <span className="font-medium">Selected element:</span> {selectedElement.tagName.toLowerCase()}
                {selectedElement.id && `#${selectedElement.id}`}
                {selectedElement.className && typeof selectedElement.className === 'string' && 
                  selectedElement.className.split(' ').map(c => c && `.${c}`).join('')}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancelFeedback}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitFeedback}
                disabled={!comment.trim()}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                  comment.trim()
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-blue-300 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Display feedback markers */}
      {showFeedbackItems && currentPageFeedbackItems.map((item) => (
        <FeedbackMarker
          key={item.id}
          feedback={item}
          onStatusChange={showStatuses ? updateFeedbackStatus : undefined}
          onDelete={showStatuses ? removeFeedbackItem : undefined}
          showDetails={showStatuses}
        />
      ))}
    </>
  );
};

export default SimpleFeedbackSystem;