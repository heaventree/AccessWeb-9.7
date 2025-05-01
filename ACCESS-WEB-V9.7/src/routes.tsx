
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VerificationDashboardPage from './pages/admin/VerificationDashboardPage';
import Checkout from './pages/checkout';
import Subscribe from './pages/Subscribe';

/**
 * Application Routes
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Existing routes would go here */}
      
      {/* Payment routes */}
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/subscribe" element={<Subscribe />} />
      
      {/* Admin routes */}
      <Route path="/admin/verification" element={<VerificationDashboardPage />} />
    </Routes>
  );
};

export default AppRoutes;
