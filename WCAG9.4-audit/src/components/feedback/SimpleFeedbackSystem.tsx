import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Feedback item structure
interface FeedbackItem {
  id: string;
  position: { x: number; y: number };
  elementPath: string;
  comment: string;
  status: 'pending' | 'inProgress' | 'resolved';
  createdAt: string;
  category: 'roadmap' | 'debug';
}

const SimpleFeedbackSystem: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [currentComment, setCurrentComment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'roadmap' | 'debug'>('debug');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<{x: number, y: number} | null>(null);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Load feedback items from localStorage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem('feedbackItems');
    if (storedItems) {
      setFeedbackItems(JSON.parse(storedItems));
    }
  }, []);
  
  // Save feedback items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('feedbackItems', JSON.stringify(feedbackItems));
  }, [feedbackItems]);
  
  // Handle document interaction when feedback tool is active
  useEffect(() => {
    if (!isActive) return;
    
    // Handle mouse movement for element highlighting
    const handleMouseOver = (e: MouseEvent) => {
      if (widgetRef.current && widgetRef.current.contains(e.target as Node)) return;
      
      // Highlight the element under cursor
      const element = e.target as HTMLElement;
      if (element !== hoveredElement) {
        // Remove highlight from previous element
        if (hoveredElement) {
          hoveredElement.style.outline = '';
          hoveredElement.style.outlineOffset = '';
        }
        
        // Add highlight to current element
        element.style.outline = '2px solid #3b82f6';
        element.style.outlineOffset = '2px';
        setHoveredElement(element);
      }
    };
    
    // Handle click to select an element
    const handleClick = (e: MouseEvent) => {
      // Don't capture clicks on the feedback tool itself
      if (widgetRef.current && widgetRef.current.contains(e.target as Node)) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      // Get click position and element
      setSelectedPosition({ x: e.pageX, y: e.pageY });
      setSelectedElement(e.target as HTMLElement);
      setShowCommentModal(true);
      
      // Remove highlights
      document.body.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.outlineOffset = '';
      });
      
      // Exit targeting mode (but keep modal open for comment)
      setIsActive(false);
    };
    
    // Allow ESC to cancel
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsActive(false);
        // Remove highlights
        document.body.querySelectorAll('*').forEach(el => {
          (el as HTMLElement).style.outline = '';
          (el as HTMLElement).style.outlineOffset = '';
        });
      }
    };
    
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleKeyDown);
    
    // Cursor style to indicate clickable page
    document.body.style.cursor = 'crosshair';
    
    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.cursor = '';
      
      // Remove any lingering highlights
      document.body.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.outline = '';
        (el as HTMLElement).style.outlineOffset = '';
      });
    };
  }, [isActive, hoveredElement]);
  
  // Generate a simple path for the element (captures the essentials but keeps it simple)
  const getElementPath = (element: HTMLElement): string => {
    if (!element) return '';
    if (element === document.body) return 'body';
    
    let selector = element.tagName.toLowerCase();
    
    // Add id if available
    if (element.id) {
      selector += `#${element.id}`;
      return selector;
    }
    
    // Add classes if available
    if (element.className && typeof element.className === 'string') {
      const classes = element.className.split(/\s+/).filter(c => c);
      if (classes.length) {
        selector += `.${classes.join('.')}`;
      }
    }
    
    // Add basic path info
    const parentElement = element.parentElement;
    if (parentElement && parentElement !== document.body) {
      return `${getElementPath(parentElement)} > ${selector}`;
    }
    
    return selector;
  };
  
  // Add a new feedback item
  const addFeedbackItem = () => {
    if (!selectedPosition || !selectedElement || !currentComment.trim()) return;
    
    const newItem: FeedbackItem = {
      id: `feedback-${Date.now()}`,
      position: selectedPosition,
      elementPath: getElementPath(selectedElement),
      comment: currentComment.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      category: selectedCategory
    };
    
    setFeedbackItems([...feedbackItems, newItem]);
    setCurrentComment('');
    setShowCommentModal(false);
    setSelectedElement(null);
  };
  
  // Update the status of a feedback item (cycles through statuses on click)
  const toggleFeedbackStatus = (id: string) => {
    setFeedbackItems(
      feedbackItems.map(item => {
        if (item.id === id) {
          const nextStatus = {
            pending: 'inProgress',
            inProgress: 'resolved',
            resolved: 'pending'
          }[item.status] as 'pending' | 'inProgress' | 'resolved';
          
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };
  
  // Delete a feedback item (right-click)
  const deleteFeedbackItem = (id: string) => {
    setFeedbackItems(feedbackItems.filter(item => item.id !== id));
  };
  
  // Get color for status
  const getStatusColor = (status: string, category: string) => {
    if (status === 'pending') {
      return category === 'roadmap' ? 'bg-blue-500' : 'bg-red-500';
    } else if (status === 'inProgress') {
      return category === 'roadmap' ? 'bg-indigo-500' : 'bg-orange-500';
    } else {
      return 'bg-green-500';
    }
  };
  
  // Render status icon
  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'pending') return <Clock className="h-3 w-3" />;
    if (status === 'inProgress') return <AlertCircle className="h-3 w-3" />;
    return <CheckCircle className="h-3 w-3" />;
  };
  
  // Reset all feedback (for testing)
  const resetAllFeedback = () => {
    if (window.confirm('Are you sure you want to reset all feedback?')) {
      setFeedbackItems([]);
      localStorage.removeItem('feedbackItems');
    }
  };
  
  return (
    <div ref={widgetRef}>
      {/* Feedback Button */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        {/* Category Switch */}
        <div className="mb-2 bg-white rounded-md shadow-sm border border-gray-200 p-1 flex text-xs">
          <button
            onClick={() => setSelectedCategory('debug')}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedCategory === 'debug' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            Debug
          </button>
          <button
            onClick={() => setSelectedCategory('roadmap')}
            className={`px-3 py-1 rounded-md transition-colors ${
              selectedCategory === 'roadmap' 
                ? 'bg-blue-100 text-blue-700' 
                : 'hover:bg-gray-100'
            }`}
          >
            Roadmap
          </button>
        </div>
        
        <button
          onClick={() => setIsActive(!isActive)}
          className={`rounded-full h-12 w-12 shadow-lg flex items-center justify-center transition-colors ${
            isActive ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
          }`}
          title={isActive ? 'Cancel' : 'Click to add feedback'}
        >
          {isActive ? <X className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
        </button>
        
        {/* Reset button (only visible if feedback exists) */}
        {feedbackItems.length > 0 && (
          <button
            onClick={resetAllFeedback}
            className="mt-2 text-xs bg-white p-1 rounded border border-gray-200 hover:bg-gray-50 shadow-sm"
            title="Reset all feedback markers"
          >
            Reset All
          </button>
        )}
      </div>
      
      {/* Feedback Markers */}
      {feedbackItems.map(item => (
        <div
          key={item.id}
          className={`fixed z-40 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-md text-white hover:scale-110 transition-transform ${getStatusColor(item.status, item.category)}`}
          style={{
            left: item.position.x,
            top: item.position.y,
            transform: 'translate(-50%, -50%)'
          }}
          title={`${item.comment.substring(0, 20)}${item.comment.length > 20 ? '...' : ''} (Click to change status, right-click to delete)`}
          onClick={() => toggleFeedbackStatus(item.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            deleteFeedbackItem(item.id);
          }}
        >
          <StatusIcon status={item.status} />
        </div>
      ))}
      
      {/* Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-80 max-w-[95vw] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Add Feedback</h3>
              <button 
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedElement(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="text-xs bg-gray-100 p-2 rounded mb-4 overflow-hidden">
              <div className="font-medium mb-1">Element selected:</div>
              <div className="truncate opacity-60">
                {selectedElement ? getElementPath(selectedElement) : 'None'}
              </div>
            </div>
            
            <textarea
              value={currentComment}
              onChange={(e) => setCurrentComment(e.target.value)}
              placeholder="Enter your feedback here..."
              className="w-full border border-gray-300 rounded-md p-2 mb-4 h-24 text-sm"
              autoFocus
            />
            
            <div className="flex justify-end">
              <button
                onClick={addFeedbackItem}
                disabled={!currentComment.trim()}
                className={`px-4 py-2 rounded-md text-white ${
                  currentComment.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      
      {isActive && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-md shadow-lg text-sm z-50 border border-gray-200">
          Click anywhere on the page to add feedback
        </div>
      )}
    </div>
  );
};

export default SimpleFeedbackSystem;