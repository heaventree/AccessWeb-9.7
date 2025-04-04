import React, { createContext, useState, useContext } from 'react';
import { cn } from '../../lib/utils';

type TabsContextType = {
  activeTab: string;
  setActiveTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a TabsProvider');
  }
  return context;
}

export function Tabs({ 
  defaultValue, 
  className, 
  children 
}: { 
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsList({ 
  className, 
  children 
}: { 
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div 
      className={cn('flex flex-wrap border-b border-gray-200', className)}
      role="tablist"
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ 
  value, 
  className, 
  children 
}: { 
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`tab-${value}`}
      id={`tab-trigger-${value}`}
      className={cn(
        'px-4 py-3 text-sm font-medium transition-all -mb-px',
        isActive 
          ? 'border-b-2 border-blue-600 text-blue-600' 
          : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300',
        className
      )}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ 
  value, 
  className, 
  children 
}: { 
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { activeTab } = useTabs();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      tabIndex={0}
      aria-labelledby={`tab-trigger-${value}`}
      id={`tab-${value}`}
      className={cn('pt-4', className)}
    >
      {children}
    </div>
  );
}