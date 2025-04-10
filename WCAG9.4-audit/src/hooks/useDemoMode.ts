import { useState, useEffect, useCallback } from 'react';

// Types for subscription demo data
import { Plan, Subscription, Invoice } from './useSubscription';

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  
  // Check if demo mode is active
  useEffect(() => {
    const demoModeActive = localStorage.getItem('demo_mode') === 'true';
    setIsDemoMode(demoModeActive);
    
    // Listen for storage events (if demo mode is toggled in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'demo_mode') {
        setIsDemoMode(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Generate realistic demo subscription plans
  const getDemoSubscriptionPlans = useCallback((): Plan[] => {
    return [
      {
        id: 'basic',
        name: 'Basic',
        description: 'Accessibility testing for small websites',
        priceMonthly: 49,
        priceYearly: 470,
        features: [
          'Single website scanning',
          'Basic WCAG 2.2 compliance reports',
          'Email support',
          'Up to 100 pages per scan',
          'Monthly scan limit: 5',
        ],
        isPopular: false
      },
      {
        id: 'professional',
        name: 'Professional',
        description: 'Complete solution for growing businesses',
        priceMonthly: 99,
        priceYearly: 950,
        features: [
          'Up to 5 websites',
          'Detailed WCAG compliance reports',
          'Priority email support',
          'Up to 500 pages per scan',
          'Monthly scan limit: 20',
          'PDF & CSV exports',
          'Custom branding on reports',
        ],
        isPopular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Advanced solutions for large organizations',
        priceMonthly: 299,
        priceYearly: 2870,
        features: [
          'Unlimited websites',
          'Complete WCAG compliance suite',
          'Dedicated account manager',
          'Phone & email support',
          'Unlimited pages per scan',
          'Unlimited scans',
          'API access',
          'Custom integrations',
          'Team collaboration tools',
          'Compliance monitoring',
        ],
        isPopular: false
      }
    ];
  }, []);

  // Generate demo subscription data
  const getDemoSubscription = useCallback((): Subscription => {
    return {
      id: 'sub_demo123',
      status: 'active',
      planId: 'professional',
      planName: 'Professional',
      currentPeriodStart: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false,
      paymentMethod: {
        brand: 'visa',
        last4: '4242'
      }
    };
  }, []);

  // Generate demo invoices
  const getDemoInvoices = useCallback((): Invoice[] => {
    const today = new Date();
    
    return [
      {
        id: 'inv_demo001',
        number: 'INV-001',
        amount: 99,
        currency: 'usd',
        status: 'paid',
        date: new Date(today.getFullYear(), today.getMonth() - 1, 15).toISOString(),
        pdfUrl: '#'
      },
      {
        id: 'inv_demo002',
        number: 'INV-002',
        amount: 99,
        currency: 'usd',
        status: 'paid',
        date: new Date(today.getFullYear(), today.getMonth() - 2, 15).toISOString(),
        pdfUrl: '#'
      },
      {
        id: 'inv_demo003',
        number: 'INV-003',
        amount: 99,
        currency: 'usd',
        status: 'paid',
        date: new Date(today.getFullYear(), today.getMonth() - 3, 15).toISOString(),
        pdfUrl: '#'
      }
    ];
  }, []);

  // Demo mode website scanning data
  const getDemoScanResults = useCallback(() => {
    return {
      sites: [
        {
          id: 'site_demo1',
          url: 'https://demo-company.com',
          name: 'Demo Company Website',
          lastScan: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          complianceScore: 87,
          issues: {
            critical: 2,
            major: 5,
            minor: 12
          }
        },
        {
          id: 'site_demo2',
          url: 'https://demo-blog.com',
          name: 'Company Blog',
          lastScan: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          complianceScore: 92,
          issues: {
            critical: 1,
            major: 2,
            minor: 8
          }
        },
        {
          id: 'site_demo3',
          url: 'https://demo-store.com',
          name: 'E-commerce Store',
          lastScan: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'in_progress',
          complianceScore: null,
          issues: null
        }
      ],
      totalScans: 12,
      remainingScans: 8,
      scanHistory: [
        {
          id: 'scan_001',
          siteId: 'site_demo1',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          pagesScanned: 48,
          complianceScore: 87,
          status: 'completed'
        },
        {
          id: 'scan_002',
          siteId: 'site_demo1',
          date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
          pagesScanned: 45,
          complianceScore: 81,
          status: 'completed'
        },
        {
          id: 'scan_003',
          siteId: 'site_demo2',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          pagesScanned: 32,
          complianceScore: 92,
          status: 'completed'
        },
        {
          id: 'scan_004',
          siteId: 'site_demo3',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          pagesScanned: 15,
          complianceScore: null,
          status: 'in_progress'
        }
      ]
    };
  }, []);

  // Helper functions to check if demo mode is active
  const isDemoActive = useCallback((): boolean => {
    return isDemoMode;
  }, [isDemoMode]);

  // Toggle demo mode
  const toggleDemoMode = useCallback((active: boolean) => {
    if (active) {
      localStorage.setItem('demo_mode', 'true');
    } else {
      localStorage.removeItem('demo_mode');
    }
    setIsDemoMode(active);
  }, []);

  return {
    isDemoMode,
    isDemoActive,
    toggleDemoMode,
    getDemoSubscriptionPlans,
    getDemoSubscription,
    getDemoInvoices,
    getDemoScanResults
  };
}