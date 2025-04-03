import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ContainerIdContextType {
  showContainerId: boolean;
  toggleContainerId: () => void;
}

const ContainerIdContext = createContext<ContainerIdContextType | undefined>(undefined);

export function ContainerIdProvider({ children }: { children: ReactNode }) {
  const [showContainerId, setShowContainerId] = useState(false);

  const toggleContainerId = () => {
    setShowContainerId(prev => !prev);
  };

  return (
    <ContainerIdContext.Provider value={{ showContainerId, toggleContainerId }}>
      {children}
    </ContainerIdContext.Provider>
  );
}

export function useContainerId() {
  const context = useContext(ContainerIdContext);
  if (context === undefined) {
    throw new Error('useContainerId must be used within a ContainerIdProvider');
  }
  return context;
}