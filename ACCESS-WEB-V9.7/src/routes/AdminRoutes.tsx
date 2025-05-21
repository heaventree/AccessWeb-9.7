import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import AdminDashboard from '../components/admin/AdminDashboard';
import UserManagement from '../components/admin/UserManagement';
import SubscriptionPlans from '../components/admin/SubscriptionPlans';
import SubscriptionManagement from '../components/admin/SubscriptionManagement';
import AdminSettings from '../components/admin/AdminSettings';
import { useAuth } from '../contexts/AuthContext';

const AdminRoutes: React.FC = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
    </div>;
  }
  
  // Redirect to login if not authenticated or not an admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace state={{ from: { pathname: '/admin' } }} />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="plans" element={<SubscriptionPlans />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;