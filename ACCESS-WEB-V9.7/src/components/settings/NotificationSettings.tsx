import React, { useState, useEffect } from 'react';
import { Bell, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userApi } from '../../lib/apiClient';
import toast from 'react-hot-toast';

export function NotificationSettings() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    browserNotifications: true,
    scanCompleted: true,
    criticalIssues: true,
    weeklyDigest: true,
    monthlyReports: false,
    usageAlerts: true,
    teamUpdates: false,
    renewalReminders: true,
    paymentNotifications: true,
    securityAlerts: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load user notification preferences when component mounts
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const response = await userApi.getNotificationPreferences(user.id);
        if (response.preferences) {
          setNotifications(response.preferences);
        }
      } catch (error) {
        console.error('Error loading notification preferences:', error);
        toast.error('Failed to load notification preferences');
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const handleChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    if (!user) {
      toast.error('You must be logged in to save preferences');
      return;
    }

    setIsSaving(true);
    
    try {
      await userApi.updateNotificationPreferences(user.id, notifications);
      toast.success('Notification preferences saved successfully!');
    } catch (error: any) {
      console.error('Error saving notification preferences:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save preferences';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
          <p className="mt-1 text-sm text-gray-500">Choose when and how you want to be notified.</p>
        </div>
        <div className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Notification Preferences</h2>
        <p className="mt-1 text-sm text-gray-500">Choose when and how you want to be notified.</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notifications.emailNotifications}
            onClick={() => handleChange('emailNotifications')}
            className={`${
              notifications.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span
              aria-hidden="true"
              className={`${
                notifications.emailNotifications ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Browser Notifications</h3>
            <p className="text-sm text-gray-500">Show notifications in your browser</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notifications.browserNotifications}
            onClick={() => handleChange('browserNotifications')}
            className={`${
              notifications.browserNotifications ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span
              aria-hidden="true"
              className={`${
                notifications.browserNotifications ? 'translate-x-5' : 'translate-x-0'
              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
          </button>
        </div>

        <div className="space-y-4 border-t border-gray-200 pt-6">
          <div className="flex items-center">
            <input
              id="scanCompleted"
              type="checkbox"
              checked={notifications.scanCompleted}
              onChange={() => handleChange('scanCompleted')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="scanCompleted" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Scan Completed</span>
              <p className="text-sm text-gray-500">Get notified when a scan is completed</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="criticalIssues"
              type="checkbox"
              checked={notifications.criticalIssues}
              onChange={() => handleChange('criticalIssues')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="criticalIssues" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Critical Issues</span>
              <p className="text-sm text-gray-500">Get notified about critical accessibility issues</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="weeklyDigest"
              type="checkbox"
              checked={notifications.weeklyDigest}
              onChange={() => handleChange('weeklyDigest')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="weeklyDigest" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Weekly Digest</span>
              <p className="text-sm text-gray-500">Receive a weekly summary of accessibility updates</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="usageAlerts"
              type="checkbox"
              checked={notifications.usageAlerts}
              onChange={() => handleChange('usageAlerts')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="usageAlerts" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Usage Alerts</span>
              <p className="text-sm text-gray-500">Get notified when approaching usage limits</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="teamUpdates"
              type="checkbox"
              checked={notifications.teamUpdates}
              onChange={() => handleChange('teamUpdates')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="teamUpdates" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Team Updates</span>
              <p className="text-sm text-gray-500">Receive notifications about team activity</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="monthlyReports"
              type="checkbox"
              checked={notifications.monthlyReports}
              onChange={() => handleChange('monthlyReports')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="monthlyReports" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Monthly Reports</span>
              <p className="text-sm text-gray-500">Receive monthly accessibility reports</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="renewalReminders"
              type="checkbox"
              checked={notifications.renewalReminders}
              onChange={() => handleChange('renewalReminders')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="renewalReminders" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Renewal Reminders</span>
              <p className="text-sm text-gray-500">Get notified about subscription renewals</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="paymentNotifications"
              type="checkbox"
              checked={notifications.paymentNotifications}
              onChange={() => handleChange('paymentNotifications')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="paymentNotifications" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Payment Notifications</span>
              <p className="text-sm text-gray-500">Get notified about payments and billing</p>
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="securityAlerts"
              type="checkbox"
              checked={notifications.securityAlerts}
              onChange={() => handleChange('securityAlerts')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="securityAlerts" className="ml-3">
              <span className="text-sm font-medium text-gray-900">Security Alerts</span>
              <p className="text-sm text-gray-500">Receive important security notifications</p>
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}