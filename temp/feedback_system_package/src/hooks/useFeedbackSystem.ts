import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  FeedbackCategory, 
  FeedbackItem, 
  FeedbackStatus, 
  Position,
  CreateFeedbackPayload
} from '../types/feedback';
import { findElementByPath } from '../utils/elementFinder';

const STORAGE_KEY = 'feedbackItems';

// Custom hook to manage feedback items
export function useFeedbackSystem() {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [currentCategory, setCurrentCategory] = useState<FeedbackCategory>(FeedbackCategory.USABILITY);

  // Load feedback items from storage on initial render
  useEffect(() => {
    const storedItems = localStorage.getItem(STORAGE_KEY);
    if (storedItems) {
      try {
        setFeedbackItems(JSON.parse(storedItems));
      } catch (error) {
        console.error('Error parsing stored feedback items:', error);
      }
    }
  }, []);

  // Save feedback items to storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackItems));
  }, [feedbackItems]);

  // Update positions of feedback markers when page scrolls
  useEffect(() => {
    const updateMarkerPositions = () => {
      setFeedbackItems(prevItems => 
        prevItems.map(item => {
          const element = findElementByPath(item.elementPath);
          if (element) {
            const rect = element.getBoundingClientRect();
            return {
              ...item,
              position: {
                x: rect.left + window.scrollX + (rect.width / 2),
                y: rect.top + window.scrollY + (rect.height / 2)
              }
            };
          }
          return item;
        })
      );
    };

    window.addEventListener('scroll', updateMarkerPositions);
    window.addEventListener('resize', updateMarkerPositions);

    return () => {
      window.removeEventListener('scroll', updateMarkerPositions);
      window.removeEventListener('resize', updateMarkerPositions);
    };
  }, []);

  // Toggle feedback mode
  const toggleFeedbackMode = useCallback(() => {
    setIsActive(prev => !prev);
    if (selectedElement) {
      setSelectedElement(null);
    }
  }, [selectedElement]);

  // Add new feedback item
  const addFeedbackItem = useCallback((payload: CreateFeedbackPayload) => {
    const newItem: FeedbackItem = {
      id: uuidv4(),
      elementPath: payload.elementPath,
      position: payload.position,
      comment: payload.comment,
      category: payload.category,
      status: FeedbackStatus.PENDING,
      createdAt: new Date().toISOString(),
      page: payload.page
    };

    setFeedbackItems(prev => [...prev, newItem]);
    return newItem;
  }, []);

  // Update feedback item status
  const updateFeedbackStatus = useCallback((id: string, status: FeedbackStatus) => {
    setFeedbackItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? { 
              ...item, 
              status,
              updatedAt: new Date().toISOString()
            } 
          : item
      )
    );
  }, []);

  // Remove feedback item
  const removeFeedbackItem = useCallback((id: string) => {
    setFeedbackItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // Get feedback items for the current page
  const getFeedbackItemsForPage = useCallback((page: string) => {
    return feedbackItems.filter(item => item.page === page);
  }, [feedbackItems]);

  return {
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
  };
}