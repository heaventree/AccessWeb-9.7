import { useState, useEffect, useRef } from 'react';
import { FeedbackItem, FeedbackCategory } from '../types/feedback';

// Hook to manage feedback items with localStorage persistence
export function useFeedbackSystem(currentPage: string) {
  // State for the feedback system
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedbackItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>('debug');
  
  // Load feedback items from localStorage on mount
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem('feedbackItems');
      if (savedItems) {
        setFeedbackItems(JSON.parse(savedItems));
      }
    } catch (error) {
      console.error('Failed to load feedback items:', error);
    }
  }, []);
  
  // Filter items for the current page or update the data structure if needed
  useEffect(() => {
    // Ensure all items have a page property (for backward compatibility)
    const updatedItems = feedbackItems.map(item => {
      if (!item.page) {
        return { ...item, page: '/' };  // Default to homepage if no page info
      }
      return item;
    });
    
    if (JSON.stringify(updatedItems) !== JSON.stringify(feedbackItems)) {
      setFeedbackItems(updatedItems);
    }
    
    // Filter items to only show those for the current page
    const pageItems = updatedItems.filter(item => item.page === currentPage);
    setFilteredItems(pageItems);
  }, [feedbackItems, currentPage]);
  
  // Save feedback items to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('feedbackItems', JSON.stringify(feedbackItems));
      // Dispatch event for any subscribers
      const event = new CustomEvent('feedbackItemsUpdated', { detail: feedbackItems });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to save feedback items:', error);
    }
  }, [feedbackItems]);
  
  // Add a new feedback item
  const addFeedbackItem = (newItem: Omit<FeedbackItem, 'id' | 'createdAt' | 'status'>) => {
    const completeItem: FeedbackItem = {
      ...newItem,
      id: `feedback-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      page: currentPage
    };
    
    setFeedbackItems(prev => [...prev, completeItem]);
    return completeItem;
  };
  
  // Update the status of a feedback item (cycles through statuses)
  const toggleFeedbackStatus = (id: string) => {
    setFeedbackItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const nextStatus = {
            pending: 'inProgress',
            inProgress: 'resolved',
            resolved: 'pending'
          }[item.status] as 'pending' | 'inProgress' | 'resolved';
          
          const updatedItem = { ...item, status: nextStatus };
          
          // Dispatch event for status change
          const event = new CustomEvent('feedbackUpdated', { detail: updatedItem });
          window.dispatchEvent(event);
          
          return updatedItem;
        }
        return item;
      })
    );
  };
  
  // Delete a feedback item
  const deleteFeedbackItem = (id: string) => {
    setFeedbackItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Reset all feedback
  const resetAllFeedback = () => {
    if (window.confirm('Are you sure you want to reset all feedback?')) {
      setFeedbackItems([]);
      localStorage.removeItem('feedbackItems');
    }
  };

  return {
    feedbackItems,
    filteredItems,
    selectedCategory,
    setSelectedCategory,
    addFeedbackItem,
    toggleFeedbackStatus,
    deleteFeedbackItem,
    resetAllFeedback
  };
}