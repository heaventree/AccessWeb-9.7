import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const AdminBypass: React.FC = () => {
  useEffect(() => {
    // Set mock authentication data directly in localStorage
    localStorage.setItem('admin_access_token', 'mock_admin_token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      name: 'Admin User',
      email: 'admin@accessweb.com',
      isAdmin: true
    }));
  }, []);

  // Immediately redirect to admin page
  return <Navigate to="/admin" replace />;
};

export default AdminBypass;