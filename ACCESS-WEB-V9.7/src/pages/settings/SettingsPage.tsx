import { useState } from 'react';
import { Settings, Bell, Lock, Users, CreditCard } from 'lucide-react';
import { AccountSettings } from '../../components/settings/AccountSettings';
import { NotificationSettings } from '../../components/settings/NotificationSettings';
import { SecuritySettings } from '../../components/settings/SecuritySettings';
import { TeamSettings } from '../../components/settings/TeamSettings';
import { BillingSettings } from '../../components/settings/BillingSettings';

type SettingsTab = 'account' | 'notifications' | 'security' | 'team' | 'billing';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          Account Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account preferences and settings
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
        <nav className="flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('account')}
            className={`whitespace-nowrap py-3 px-4 font-medium text-sm flex items-center border-b-2 ${
              activeTab === 'account'
                ? 'border-[#0fae96] text-[#0fae96] dark:text-[#5eead4] dark:border-[#5eead4]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            General
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`whitespace-nowrap py-3 px-4 font-medium text-sm flex items-center border-b-2 ${
              activeTab === 'notifications'
                ? 'border-[#0fae96] text-[#0fae96] dark:text-[#5eead4] dark:border-[#5eead4]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`whitespace-nowrap py-3 px-4 font-medium text-sm flex items-center border-b-2 ${
              activeTab === 'security'
                ? 'border-[#0fae96] text-[#0fae96] dark:text-[#5eead4] dark:border-[#5eead4]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Lock className="w-4 h-4 mr-2" />
            Security
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`whitespace-nowrap py-3 px-4 font-medium text-sm flex items-center border-b-2 ${
              activeTab === 'team'
                ? 'border-[#0fae96] text-[#0fae96] dark:text-[#5eead4] dark:border-[#5eead4]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Team
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`whitespace-nowrap py-3 px-4 font-medium text-sm flex items-center border-b-2 ${
              activeTab === 'billing'
                ? 'border-[#0fae96] text-[#0fae96] dark:text-[#5eead4] dark:border-[#5eead4]'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            <CreditCard className="w-4 h-4 mr-2" />
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
  );
}