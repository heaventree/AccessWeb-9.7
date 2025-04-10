import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define types for the floating tools
export type FloatingToolType = 'support' | 'accessibility' | 'feedback' | 'demo' | null;

// Define the context shape
interface FloatingToolsContextType {
  activeTool: FloatingToolType;
  setActiveTool: (tool: FloatingToolType) => void;
  toggleTool: (tool: FloatingToolType) => void;
  isFeedbackEnabled: boolean;
  toggleFeedbackSystem: () => void;
}

// Create the context with a default value
const FloatingToolsContext = createContext<FloatingToolsContextType>({
  activeTool: null,
  setActiveTool: () => {},
  toggleTool: () => {},
  isFeedbackEnabled: true,
  toggleFeedbackSystem: () => {},
});

// Create a provider component
export function FloatingToolsProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<FloatingToolType>(null);
  const [isFeedbackEnabled, setIsFeedbackEnabled] = useState<boolean>(true);

  // Load feedback preference from localStorage on mount
  useEffect(() => {
    try {
      const savedPreference = localStorage.getItem('feedbackEnabled');
      if (savedPreference !== null) {
        setIsFeedbackEnabled(JSON.parse(savedPreference));
      }
    } catch (error) {
      console.error('Failed to load feedback preference:', error);
    }
  }, []);

  // Toggle a tool (close if it's already active, open if not)
  const toggleTool = (tool: FloatingToolType) => {
    setActiveTool(current => (current === tool ? null : tool));
  };

  // Toggle feedback system visibility
  const toggleFeedbackSystem = () => {
    const newValue = !isFeedbackEnabled;
    console.log('FloatingToolsContext: Toggling feedback system from', isFeedbackEnabled, 'to', newValue);
    setIsFeedbackEnabled(newValue);
    try {
      localStorage.setItem('feedbackEnabled', JSON.stringify(newValue));
      console.log('FloatingToolsContext: Saved preference to localStorage');
    } catch (error) {
      console.error('Failed to save feedback preference:', error);
    }
  };

  return (
    <FloatingToolsContext.Provider
      value={{
        activeTool,
        setActiveTool,
        toggleTool,
        isFeedbackEnabled,
        toggleFeedbackSystem,
      }}
    >
      {children}
    </FloatingToolsContext.Provider>
  );
}

// Create a hook for using the floating tools context
export function useFloatingTools() {
  const context = useContext(FloatingToolsContext);
  
  if (context === undefined) {
    throw new Error('useFloatingTools must be used within a FloatingToolsProvider');
  }
  
  return context;
}