import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const DebugUserInfo: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-4 text-sm z-50">
        <h3 className="font-bold text-blue-800">Debug: Loading...</h3>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-300 rounded-lg p-4 text-sm z-50 max-w-sm">
      <h3 className="font-bold text-yellow-800 mb-2">Debug User Info:</h3>
      <div className="space-y-1 text-yellow-700">
        <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>User ID:</strong> {user?.id || 'None'}</p>
        <p><strong>Email:</strong> {user?.email || 'None'}</p>
        <p><strong>Role:</strong> {user?.role || 'None'}</p>
        <p><strong>Is Admin:</strong> {user?.isAdmin ? 'Yes' : 'No'}</p>
        <p><strong>Plan:</strong> {user?.subscription?.plan || 'None'}</p>
        <p><strong>Status:</strong> {user?.subscription?.status || 'None'}</p>
      </div>
      <button 
        onClick={() => {
          console.log('Full user object:', user);
          console.log('Auth state:', { isAuthenticated, loading });
          console.log('LocalStorage dev_role:', localStorage.getItem('dev_role'));
          console.log('Current URL:', window.location.href);
        }}
        className="mt-2 text-xs bg-yellow-200 hover:bg-yellow-300 px-2 py-1 rounded"
      >
        Log to Console
      </button>
    </div>
  );
};