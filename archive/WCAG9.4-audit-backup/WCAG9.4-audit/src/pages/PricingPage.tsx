import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard } from 'lucide-react';

interface Plan {
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Basic',
    price: 999,
    interval: 'per year',
    description: 'Perfect for small websites and personal projects',
    features: [
      'Up to 5 pages per scan',
      'Weekly automated scans',
      'Basic accessibility reports',
      'Email notifications',
      'Standard support'
    ]
  },
  {
    name: 'Professional',
    price: 2999,
    interval: 'per year',
    description: 'Ideal for growing businesses and agencies',
    features: [
      'Up to 25 pages per scan',
      'Daily automated scans',
      'Advanced accessibility reports',
      'Priority email support',
      'Custom badge styles',
      'API access',
      'Multiple team members'
    ],
    recommended: true
  },
  {
    name: 'Enterprise',
    price: 9999,
    interval: 'per year',
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited pages per scan',
      'Real-time monitoring',
      'Custom scan schedules',
      'Dedicated support manager',
      'Custom integrations',
      'SLA guarantees',
      'Advanced analytics',
      'Multiple domains'
    ]
  }
];

export function PricingPage() {
  const navigate = useNavigate();
  const [billingInterval, setBillingInterval] = useState<'annual' | 'one-time'>('annual');

  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise') {
      window.location.href = '/contact';
    } else {
      navigate(`/payment/${planId}`);
    }
  };

  return (
    <div className="page-container">
      <div className="content-container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Accessibility Testing Solutions
          </h1>
          <p className="text-xl text-gray-600">
            Select your ideal plan for comprehensive WCAG compliance testing
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => setBillingInterval('annual')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingInterval === 'annual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Annual License
          </button>
          <span className="text-gray-500 self-center">|</span>
          <button
            onClick={() => setBillingInterval('one-time')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              billingInterval === 'one-time'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Single Scan
          </button>
        </div>

        {billingInterval === 'annual' ? (
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-xl shadow-sm overflow-hidden border flex flex-col h-full ${
                  plan.recommended ? 'border-2 border-blue-500' : 'border-gray-200'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Most Popular
                  </div>
                )}

                <div className="p-6 flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 uppercase">{plan.name}</h3>
                  <div className="mt-4">
                    <p className="text-3xl font-bold text-gray-900">${plan.price}</p>
                    <p className="text-gray-600">{plan.interval}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-emerald-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 mt-auto">
                  <button
                    onClick={() => handleSelectPlan(plan.name.toLowerCase())}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      plan.recommended
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 inline-block mr-2" />
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-8 border-2 border-emerald-500 flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold uppercase text-gray-900">Quick Scan</h3>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">$0.20 - $0.80</p>
                  <p className="text-gray-600">per unique page (min. $20)</p>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Complete Site Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Detailed Fix Guidelines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Protected Page Support</span>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => navigate('/quick-scan')}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                  Start Quick Scan
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200 flex flex-col h-full">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold uppercase text-gray-900">Consider Annual Access</h3>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gray-900">From $599</p>
                  <p className="text-gray-600">per year</p>
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Continuous Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>Premium Features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-600" />
                    <span>24/7 Compliance Checks</span>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => setBillingInterval('annual')}
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  View Annual Plans
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}