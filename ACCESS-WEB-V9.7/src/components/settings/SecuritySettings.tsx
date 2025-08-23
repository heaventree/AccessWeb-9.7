import React, { useState, useEffect } from 'react';
import { Lock, Key, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userApi } from '../../lib/apiClient';
import toast from 'react-hot-toast';

interface SecurityLog {
  id: number;
  eventType: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: any;
  createdAt: string;
}

export function SecuritySettings() {
  const { user, refetchUser } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isUpdatingTwoFactor, setIsUpdatingTwoFactor] = useState(false);
  const [showTwoFactorVerification, setShowTwoFactorVerification] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const handlePasswordChange = async () => {
    if (!user) {
      toast.error('You must be logged in to change your password');
      return;
    }

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setIsChangingPassword(true);

    try {
      await userApi.changePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Password changed successfully!');
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Refresh security logs to show the new entry
      fetchSecurityLogs();
    } catch (error: any) {
      console.error('Error changing password:', error);
      const errorMessage = error.response?.data?.error || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const fetchSecurityLogs = async () => {
    if (!user) return;

    setIsLoadingLogs(true);
    try {
      const response = await userApi.getSecurityLogs(user.id);
      setSecurityLogs(response.securityLogs || []);
    } catch (error: any) {
      console.error('Failed to fetch security logs:', error);
      toast.error('Failed to load security logs');
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const formatEventType = (eventType: string) => {
    switch (eventType) {
      case 'password_change':
        return 'Password Changed';
      case 'login':
        return 'Login';
      case 'logout':
        return 'Logout';
      default:
        return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    fetchSecurityLogs();
    // Initialize 2FA state from user data
    if (user && (user as any).isTwoFactorEnabled !== undefined) {
      setTwoFactorEnabled((user as any).isTwoFactorEnabled);
    }
  }, [user]);

  const handleTwoFactorToggle = async () => {
    if (!user) {
      toast.error('You must be logged in to change two-factor authentication settings');
      return;
    }

    const newTwoFactorState = !twoFactorEnabled;
    setIsUpdatingTwoFactor(true);

    try {
      const response = await userApi.updateTwoFactorSettings(user.id, {
        isTwoFactorEnabled: newTwoFactorState
      });

      // If enabling 2FA and requires verification, show OTP dialog
      if (response.requiresVerification) {
        setMaskedEmail(response.email || user.email);
        setShowTwoFactorVerification(true);
        toast.success('Verification code sent to your email. Please check your inbox.');
      } else {
        // If disabling 2FA or if it's already enabled/disabled
        setTwoFactorEnabled(response.isTwoFactorEnabled);
        toast.success(response.message);
        
        // Refresh user data to get updated 2FA status
        await refetchUser();
        
        // Refresh security logs to show the new entry
        fetchSecurityLogs();
      }
    } catch (error: any) {
      console.error('Error updating two-factor authentication:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update two-factor authentication settings';
      toast.error(errorMessage);
    } finally {
      setIsUpdatingTwoFactor(false);
    }
  };

  const handleTwoFactorVerification = async () => {
    if (!user || !twoFactorCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsVerifyingCode(true);

    try {
      const response = await userApi.verifyTwoFactorSetup(user.id, twoFactorCode);
      
      setTwoFactorEnabled(true);
      setShowTwoFactorVerification(false);
      setTwoFactorCode('');
      toast.success(response.message);
      
      // Refresh user data to get updated 2FA status
      await refetchUser();
      
      // Refresh security logs to show the new entry
      fetchSecurityLogs();
    } catch (error: any) {
      console.error('Error verifying two-factor setup:', error);
      const errorMessage = error.response?.data?.error || 'Invalid or expired verification code';
      toast.error(errorMessage);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleCancelTwoFactorVerification = () => {
    setShowTwoFactorVerification(false);
    setTwoFactorCode('');
    setMaskedEmail('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
        <p className="mt-1 text-sm text-gray-500">Manage your account security preferences.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Password Change */}
        <div>
          <h3 className="text-sm font-medium text-gray-900">Change Password</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your current password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your new password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm your new password"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isChangingPassword ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Key className="w-4 h-4 mr-2" />
              )}
              {isChangingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={twoFactorEnabled}
              onClick={handleTwoFactorToggle}
              disabled={isUpdatingTwoFactor || showTwoFactorVerification}
              className={`${
                twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span
                aria-hidden="true"
                className={`${
                  twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              />
            </button>
          </div>

          {/* Two-Factor Verification Dialog */}
          {showTwoFactorVerification && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0">
                  <Key className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">Verify Two-Factor Authentication Setup</h4>
                  <p className="text-sm text-blue-700">
                    We've sent a verification code to {maskedEmail}. Please enter it below to complete the setup.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label htmlFor="twoFactorCode" className="block text-sm font-medium text-blue-900 mb-1">
                    Verification Code
                  </label>
                  <input
                    id="twoFactorCode"
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="000000"
                    maxLength={6}
                    autoComplete="one-time-code"
                  />
                  <p className="text-xs text-blue-600 mt-1 text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleTwoFactorVerification}
                    disabled={isVerifyingCode || twoFactorCode.length !== 6}
                    className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifyingCode ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Enable 2FA'
                    )}
                  </button>
                  
                  <button
                    onClick={handleCancelTwoFactorVerification}
                    disabled={isVerifyingCode}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-700">
                  <strong>Important:</strong> Once enabled, you'll need a verification code sent to this email address each time you log in. Make sure you have access to this email.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Security Log */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Security Log</h3>
          <div className="mt-4 bg-gray-50 rounded-lg overflow-hidden">
            {isLoadingLogs ? (
              <div className="px-4 py-6 text-center">
                <Loader2 className="w-6 h-6 mx-auto animate-spin text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Loading security logs...</p>
              </div>
            ) : securityLogs.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <Shield className="w-8 h-8 mx-auto text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">No security events recorded yet</p>
              </div>
            ) : (
              securityLogs.map((log, index) => (
                <div
                  key={log.id}
                  className={`px-4 py-3 ${
                    index < securityLogs.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatEventType(log.eventType)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(log.createdAt)}
                      </p>
                      {log.description && (
                        <p className="text-xs text-gray-400 mt-1">{log.description}</p>
                      )}
                    </div>
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}