import { useState } from 'react';
import { format } from 'date-fns';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  CreditCard,
  Settings,
  Bell,
  Users,
  Activity,
  BarChart2,
  MonitorPlay,
  Gauge
} from 'lucide-react';

// Mock subscription data
const subscription = {
  plan: 'Professional',
  status: 'active',
  nextBilling: new Date(2024, 2, 15),
};

export function AccountLayout() {
  const location = useLocation();
  
  return (
    <div className="flex-1">
      <Outlet />
    </div>
  );
}
