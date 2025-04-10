import { createContext, useContext, useState, ReactNode } from 'react';

// Define types for the floating tools
export type FloatingToolType = 'support' | 'accessibility' | 'feedback' | 'demo' | null;

// Define the context shape
interface FloatingToolsContextType {
  activeTool: FloatingToolType;
  setActiveTool: (tool: FloatingToolType) => void;
  toggleTool: (tool: FloatingToolType) => void;
}

// Create the context with a default value
const FloatingToolsContext = createContext<FloatingToolsContextType>({
  activeTool: null,
  setActiveTool: () => {},
  toggleTool: () => {},
});

// Create a provider component
export function FloatingToolsProvider({ children }: { children: ReactNode }) {
  const [activeTool, setActiveTool] = useState<FloatingToolType>(null);

  // Toggle a tool (close if it's already active, open if not)
  const toggleTool = (tool: FloatingToolType) => {
    setActiveTool(current => (current === tool ? null : tool));
  };

  return (
    <FloatingToolsContext.Provider
      value={{
        activeTool,
        setActiveTool,
        toggleTool,
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