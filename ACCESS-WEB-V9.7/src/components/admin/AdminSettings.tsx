import React, { useState } from 'react';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'AccessWeb Pro',
    siteEmail: 'admin@accessweb.com',
    supportEmail: 'support@accessweb.com',
    maxUserProjects: 50,
    maxFileSize: 10,
    allowTrials: true,
    trialDays: 14,
    enableEmailNotifications: true,
    enableUserRegistration: true,
    enableAutoRenew: true,
    maintenanceMode: false,
    analyticsEnabled: true,
    analyticsCode: 'UA-XXXXXXXXX-X',
    stripeEnabled: true,
    adminApprovalRequired: false,
    passwordResetExpiration: 24,
    sessionTimeoutMinutes: 60,
    databaseBackupFrequency: 'daily',
    enableDarkMode: true
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      setSettings(prev => ({
        ...prev,
        [name]: Number(value)
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      // In a real implementation, this would be an API call
      // await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      // Simulate API latency
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage({
        type: 'success',
        text: 'Settings saved successfully'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage({
        type: 'error',
        text: 'Failed to save settings'
      });
    } finally {
      setIsSaving(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Admin Settings
      </h1>
      
      {saveMessage && (
        <div className={`mb-6 p-4 rounded-xl ${
          saveMessage.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {saveMessage.text}
        </div>
      )}
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          General Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Name
            </label>
            <input
              id="siteName"
              name="siteName"
              type="text"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            />
          </div>
          
          <div>
            <label htmlFor="siteEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Email
            </label>
            <input
              id="siteEmail"
              name="siteEmail"
              type="email"
              value={settings.siteEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            />
          </div>
          
          <div>
            <label htmlFor="supportEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Support Email
            </label>
            <input
              id="supportEmail"
              name="supportEmail"
              type="email"
              value={settings.supportEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            />
          </div>
          
          <div>
            <div className="flex items-center h-full">
              <div className="flex items-center">
                <input
                  id="maintenanceMode"
                  name="maintenanceMode"
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
                />
                <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Enable Maintenance Mode
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          User & Security Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="maxUserProjects" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Projects per User
            </label>
            <input
              id="maxUserProjects"
              name="maxUserProjects"
              type="number"
              min="1"
              value={settings.maxUserProjects}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            />
          </div>
          
          <div>
            <label htmlFor="maxFileSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max File Size (MB)
            </label>
            <input
              id="maxFileSize"
              name="maxFileSize"
              type="number"
              min="1"
              value={settings.maxFileSize}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            />
          </div>
          
          <div>
            <label htmlFor="passwordResetExpiration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password Reset Link Expiration (hours)
            </label>
            <input
              id="passwordResetExpiration"
              name="passwordResetExpiration"
              type="number"
              min="1"
              value={settings.passwordResetExpiration}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            />
          </div>
          
          <div>
            <label htmlFor="sessionTimeoutMinutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Session Timeout (minutes)
            </label>
            <input
              id="sessionTimeoutMinutes"
              name="sessionTimeoutMinutes"
              type="number"
              min="1"
              value={settings.sessionTimeoutMinutes}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="enableUserRegistration"
              name="enableUserRegistration"
              type="checkbox"
              checked={settings.enableUserRegistration}
              onChange={handleChange}
              className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
            />
            <label htmlFor="enableUserRegistration" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable User Registration
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="adminApprovalRequired"
              name="adminApprovalRequired"
              type="checkbox"
              checked={settings.adminApprovalRequired}
              onChange={handleChange}
              className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
            />
            <label htmlFor="adminApprovalRequired" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Require Admin Approval for New Accounts
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Subscription Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center">
              <input
                id="allowTrials"
                name="allowTrials"
                type="checkbox"
                checked={settings.allowTrials}
                onChange={handleChange}
                className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
              />
              <label htmlFor="allowTrials" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable Free Trials
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="trialDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Trial Period (days)
            </label>
            <input
              id="trialDays"
              name="trialDays"
              type="number"
              min="1"
              value={settings.trialDays}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="enableAutoRenew"
              name="enableAutoRenew"
              type="checkbox"
              checked={settings.enableAutoRenew}
              onChange={handleChange}
              className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
            />
            <label htmlFor="enableAutoRenew" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Auto-Renewal by Default
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="stripeEnabled"
              name="stripeEnabled"
              type="checkbox"
              checked={settings.stripeEnabled}
              onChange={handleChange}
              className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
            />
            <label htmlFor="stripeEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Stripe Payments
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Settings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="databaseBackupFrequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Database Backup Frequency
            </label>
            <select
              id="databaseBackupFrequency"
              name="databaseBackupFrequency"
              value={settings.databaseBackupFrequency}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              id="enableEmailNotifications"
              name="enableEmailNotifications"
              type="checkbox"
              checked={settings.enableEmailNotifications}
              onChange={handleChange}
              className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
            />
            <label htmlFor="enableEmailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Email Notifications
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="analyticsEnabled"
              name="analyticsEnabled"
              type="checkbox"
              checked={settings.analyticsEnabled}
              onChange={handleChange}
              className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
            />
            <label htmlFor="analyticsEnabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Analytics
            </label>
          </div>
          
          <div>
            <label htmlFor="analyticsCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Analytics Tracking Code
            </label>
            <input
              id="analyticsCode"
              name="analyticsCode"
              type="text"
              value={settings.analyticsCode}
              onChange={handleChange}
              disabled={!settings.analyticsEnabled}
              className={`w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96] ${!settings.analyticsEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="enableDarkMode"
              name="enableDarkMode"
              type="checkbox"
              checked={settings.enableDarkMode}
              onChange={handleChange}
              className="h-4 w-4 text-[#0fae96] focus:ring-[#0fae96] border-gray-300 rounded"
            />
            <label htmlFor="enableDarkMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Dark Mode Option
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={isSaving}
          className="px-6 py-2 bg-[#0fae96] text-white rounded-full hover:bg-[#0d9a85] transition-colors focus:outline-none focus:ring-2 focus:ring-[#0fae96] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;