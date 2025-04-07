import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

export function EmailVerification() {
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const { token } = useParams<{ token: string }>();
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setVerifying(false);
      setError('No verification token provided');
      return;
    }

    const verify = async () => {
      try {
        setVerifying(true);
        const result = await verifyEmail(token);
        setVerified(result);
        setVerifying(false);
        
        if (result) {
          toast.success('Email verified successfully! You can now log in.');
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (err) {
        setVerifying(false);
        setError(err instanceof Error ? err.message : 'An error occurred during verification');
        toast.error(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verify();
  }, [token, verifyEmail, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-2xl font-bold">Verifying Your Email</h1>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
          <p className="text-gray-600">Please wait while we verify your email address...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
            <p>{error}</p>
          </div>
          <div className="mt-4">
            <Link to="/login" className="text-primary-600 hover:text-primary-500">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
          <p>Your email has been successfully verified. You will be redirected to the login page in a moment.</p>
        </div>
        <div className="mt-4">
          <Link to="/login" className="text-primary-600 hover:text-primary-500">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}