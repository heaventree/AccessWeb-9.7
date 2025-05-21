import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setFormError(null);
    
    // Validate inputs
    if (!email || !password) {
      setFormError('Email and password are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(email, password, name || undefined);
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Navigate or run callback
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      // Error is already handled in auth context
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Create your account
      </h2>
      
      <form onSubmit={handleSubmit}>
        {(error || formError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {formError || error}
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name (Optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            placeholder="Your name"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            placeholder="your@email.com"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            placeholder="At least 6 characters"
            required
            minLength={6}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-full text-gray-700 dark:text-gray-300 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
            placeholder="Confirm your password"
            required
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-[#0fae96] hover:bg-[#0d9a85] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0fae96] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a 
            href="/login" 
            className="font-medium text-[#0fae96] hover:text-[#0d9a85]"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;