import React from 'react';
import { Settings, Bell, Lock, Users, CreditCard } from 'lucide-react';
import { AccountSettings } from '../../components/settings/AccountSettings';
import { NotificationSettings } from '../../components/settings/NotificationSettings';
import { SecuritySettings } from '../../components/settings/SecuritySettings';
import { TeamSettings } from '../../components/settings/TeamSettings';
import { BillingSettings } from '../../components/settings/BillingSettings';

export function SettingsPage() {
  return (
    <div className="page-container">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Account Settings
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="space-y-8">
          <AccountSettings />
          <NotificationSettings />
          <SecuritySettings />
          <TeamSettings />
          <BillingSettings />
        </div>
      </div>
    </div>
  );
}