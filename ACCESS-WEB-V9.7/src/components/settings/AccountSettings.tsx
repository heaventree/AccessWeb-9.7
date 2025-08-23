import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Loader2, Key } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userApi } from '../../lib/apiClient';
import toast from 'react-hot-toast';

export function AccountSettings() {
  const { user, refetchUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    timezone: 'UTC'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Email verification states
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [maskedCurrentEmail, setMaskedCurrentEmail] = useState('');
  const [maskedNewEmail, setMaskedNewEmail] = useState('');

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        timezone: user.timezone || 'UTC' // Use user's timezone or default to UTC
      });
    }
  }, [user]);

  // Remove automatic refetch on mount to prevent continuous API calls
  // We'll only refetch after successful saves

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    setIsSaving(true);
    
    try {
      const response = await userApi.updateProfile(user.id, formData);
      
      // If email change requires verification, show OTP dialog
      if (response.requiresVerification) {
        setMaskedCurrentEmail(response.currentEmail);
        setMaskedNewEmail(response.newEmail);
        setShowEmailVerification(true);
        toast.success('Verification code sent to your current email. Please check your inbox.');
      } else {
        toast.success('Profile updated successfully!');
        
        // Refetch user data to update the UI with latest changes
        await refetchUser();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailVerification = async () => {
    if (!user || !emailVerificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    setIsVerifyingEmail(true);

    try {
      const response = await userApi.verifyEmailChange(user.id, emailVerificationCode);
      
      setShowEmailVerification(false);
      setEmailVerificationCode('');
      toast.success(response.message || 'Email address updated successfully!');
      
      // Refetch user data to get updated email
      await refetchUser();
    } catch (error: any) {
      console.error('Error verifying email change:', error);
      const errorMessage = error.response?.data?.error || 'Invalid or expired verification code';
      toast.error(errorMessage);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleCancelEmailVerification = () => {
    setShowEmailVerification(false);
    setEmailVerificationCode('');
    setMaskedCurrentEmail('');
    setMaskedNewEmail('');
    
    // Reset email field to current user email
    if (user) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  };

  if (!user) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Account Information</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update your account details and preferences.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>


        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
          <select
            id="timezone"
            value={formData.timezone}
            onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
            className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London Time</option>
            <option value="Europe/Paris">Paris Time</option>
            <option value="Asia/Tokyo">Tokyo Time</option>
            <option value="Australia/Sydney">Sydney Time</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Email Verification Dialog */}
        {showEmailVerification && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <Key className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900">Verify Email Address Change</h4>
                <p className="text-sm text-blue-700">
                  We've sent a verification code to <strong>{maskedCurrentEmail}</strong>. Please enter it below to confirm changing your email to <strong>{maskedNewEmail}</strong>.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="emailVerificationCode" className="block text-sm font-medium text-blue-900 mb-1">
                  Verification Code
                </label>
                <input
                  id="emailVerificationCode"
                  type="text"
                  value={emailVerificationCode}
                  onChange={(e) => setEmailVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000000"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
                <p className="text-xs text-blue-600 mt-1 text-center">
                  Enter the 6-digit code sent to your current email
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleEmailVerification}
                  disabled={isVerifyingEmail || emailVerificationCode.length !== 6}
                  className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifyingEmail ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Update Email'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancelEmailVerification}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                <strong>Important:</strong> The verification code will expire in 5 minutes. If you don't receive it, please check your spam folder.
              </p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}