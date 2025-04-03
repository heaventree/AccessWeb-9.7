import React, { useState } from 'react';
import { Settings, Bell, Lock, Users, CreditCard, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AccountSettings } from '../../components/settings/AccountSettings';
import { NotificationSettings } from '../../components/settings/NotificationSettings';
import { SecuritySettings } from '../../components/settings/SecuritySettings';
import { TeamSettings } from '../../components/settings/TeamSettings';
import { BillingSettings } from '../../components/settings/BillingSettings';

type SettingsTab = 'account' | 'notifications' | 'security' | 'team' | 'billing';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
          <div className="flex items-center">
            <Link to="/my-account" className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('account')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'account'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-5 h-5 inline-block mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'notifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell className="w-5 h-5 inline-block mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Lock className="w-5 h-5 inline-block mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'team'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-5 h-5 inline-block mr-2" />
              Team
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'billing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-5 h-5 inline-block mr-2" />
              Billing
            </button>
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'account' && (
            <AccountSettings />
          )}
          
          {activeTab === 'notifications' && (
            <NotificationSettings />
          )}
          
          {activeTab === 'security' && (
            <SecuritySettings />
          )}
          
          {activeTab === 'team' && (
            <TeamSettings />
          )}
          
          {activeTab === 'billing' && (
            <BillingSettings />
          )}
        </div>
      </div>
    </div>
  );
}