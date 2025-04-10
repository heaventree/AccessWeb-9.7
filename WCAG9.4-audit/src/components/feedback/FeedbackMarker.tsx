import React from 'react';
import { MessageSquare, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface FeedbackMarkerProps {
  id: string;
  position: { x: number; y: number };
  status: 'pending' | 'inProgress' | 'resolved';
  category: 'roadmap' | 'debug';
  onClick: () => void;
}

// Color schemes based on status and category
const getMarkerStyles = (status: string, category: string) => {
  // Base styles
  let bgColor = 'bg-blue-500';
  let textColor = 'text-white';
  
  // Status-specific styles
  if (status === 'pending') {
    bgColor = category === 'roadmap' ? 'bg-blue-500' : 'bg-red-500';
  } else if (status === 'inProgress') {
    bgColor = category === 'roadmap' ? 'bg-indigo-500' : 'bg-orange-500';
  } else if (status === 'resolved') {
    bgColor = category === 'roadmap' ? 'bg-green-500' : 'bg-green-500';
  }
  
  return `${bgColor} ${textColor}`;
};

// Status icons
const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-3 w-3" />;
    case 'inProgress':
      return <AlertCircle className="h-3 w-3" />;
    case 'resolved':
      return <CheckCircle className="h-3 w-3" />;
    default:
      return <MessageSquare className="h-3 w-3" />;
  }
};

const FeedbackMarker: React.FC<FeedbackMarkerProps> = ({
  id,
  position,
  status,
  category,
  onClick
}) => {
  const markerStyles = getMarkerStyles(status, category);
  
  return (
    <div
      className={`absolute z-50 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer shadow-md transform hover:scale-110 transition-transform ${markerStyles}`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={onClick}
      data-marker-id={id}
      title={`Feedback #${id.slice(0, 5)} (${status})`}
    >
      <StatusIcon status={status} />
    </div>
  );
};

export default FeedbackMarker;