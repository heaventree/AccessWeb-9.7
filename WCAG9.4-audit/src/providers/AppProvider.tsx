import React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ThemeProvider } from './ThemeProvider';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/AuthContext';
import { FloatingToolsProvider } from '../contexts/FloatingToolsContext';

// Create a mock HelmetProvider for now since it's causing compatibility issues
const MockHelmetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// Custom persister with proper Promise handling
const persister = createSyncStoragePersister({
  storage: {
    getItem: (key: string): string | null => {
      const data = localStorage.getItem(key);
      if (!data) return null;
      try {
        // Ensure we're returning a valid JSON string
        return JSON.stringify(JSON.parse(data));
      } catch {
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        localStorage.setItem(key, value);
      } catch (err) {
        console.error('Error saving to localStorage:', err);
      }
    },
    removeItem: (key: string): void => {
      localStorage.removeItem(key);
    }
  }
});

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      cacheTime: 0,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true
    }
  }
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 0,
        dehydrateOptions: {
          shouldDehydrateQuery: query => {
            // Don't persist sensitive data
            return !query.queryKey.includes('auth');
          }
        },
        serialize: (data) => {
          try {
            return JSON.stringify(data);
          } catch (err) {
            console.error('Failed to serialize query data:', err);
            return '';
          }
        },
        deserialize: (data) => {
          try {
            return JSON.parse(data);
          } catch (err) {
            console.error('Failed to deserialize query data:', err);
            return {};
          }
        }
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <FloatingToolsProvider>
            <MockHelmetProvider>
              <Toaster position="top-center" />
              {children}
            </MockHelmetProvider>
          </FloatingToolsProvider>
        </AuthProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}