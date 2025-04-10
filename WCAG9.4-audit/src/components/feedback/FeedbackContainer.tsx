import React, { useState } from 'react';
import FeedbackWidget from './FeedbackWidget';
import { addToRoadmap, addToDebugList } from '../../services/feedbackService';

interface FeedbackContainerProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

/**
 * Container for feedback widgets with toggle between roadmap and debug feedback
 */
const FeedbackContainer: React.FC<FeedbackContainerProps> = ({ position = 'bottom-right' }) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'debug'>('debug');
  
  // Handle feedback submission
  const handleFeedbackSubmitted = (feedback: any) => {
    if (activeTab === 'roadmap') {
      // Add to roadmap
      addToRoadmap(feedback);
    } else {
      // Add to debug list
      addToDebugList(feedback);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Tab switcher */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-1 flex text-xs">
        <button
          onClick={() => setActiveTab('debug')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeTab === 'debug' 
              ? 'bg-blue-100 text-blue-700' 
              : 'hover:bg-gray-100'
          }`}
        >
          Debug
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-3 py-1 rounded-md transition-colors ${
            activeTab === 'roadmap' 
              ? 'bg-blue-100 text-blue-700' 
              : 'hover:bg-gray-100'
          }`}
        >
          Roadmap
        </button>
      </div>
      
      {/* Active feedback widget */}
      <FeedbackWidget 
        addToRoadmap={activeTab === 'roadmap'}
        onFeedbackSubmitted={handleFeedbackSubmitted}
        position={position}
      />
    </div>
  );
};

export default FeedbackContainer;