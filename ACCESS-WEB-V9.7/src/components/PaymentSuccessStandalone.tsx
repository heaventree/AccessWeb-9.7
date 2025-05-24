import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessStandalone() {
  const [searchParams] = useSearchParams();
  const paymentIntent = searchParams.get('payment_intent');
  const redirectStatus = searchParams.get('redirect_status');

  // Simple success page for payment confirmation
  if (!paymentIntent || redirectStatus !== 'succeeded') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 dark:text-red-400 text-2xl">✕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Error
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Invalid payment confirmation
            </p>
            <a
              href="/billing"
              className="inline-flex items-center px-6 py-3 bg-[#0fae96] text-white rounded-full font-medium hover:bg-[#0fae96]/90 transition-colors"
            >
              Back to Billing
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for your subscription! Your payment has been processed successfully.
          </p>

          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Payment Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Plan:</span>
                <span className="text-gray-900 dark:text-white">Enterprise Plan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                <span className="text-gray-900 dark:text-white">$199.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Payment ID:</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs">{paymentIntent}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href="/dashboard"
              className="block w-full py-3 px-4 bg-[#0fae96] text-white rounded-full font-medium hover:bg-[#0fae96]/90 transition-colors text-center"
            >
              Go to Dashboard
            </a>
            
            <a
              href="/billing"
              className="block w-full py-3 px-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-center"
            >
              View Billing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}