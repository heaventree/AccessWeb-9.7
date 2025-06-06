import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  CreditCard,
  Settings,
  FileText,
  Bell,
  Users,
  Activity,
  RefreshCw,
  Shield,
  Layers,
  Globe,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ScanResultModal from '../components/ScanResultModal';


interface ScanResult {
  id: number;
  url: string;
  siteName: string;
  score: number;
  errorCount: number;
  warningCount: number;
  noticeCount: number;
  scanStatus: string;
  scanDuration: number;
  createdAt: string;
  platform: string;
  issues: number;
  rawResults?: any;
}

export function SubscriptionDashboard() {
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    scansThisMonth: 0,
    totalScans: 0,
    pagesScanned: 0,
    teamMembers: 0
  });

  const subscription = {
    plan: 'Professional',
    status: 'active',
    nextBilling: new Date(2024, 2, 15),
    paymentMethod: '**** **** **** 4242'
  };

  // API client for making authenticated requests
  const apiRequest = async (method: string, endpoint: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  };

  useEffect(() => {
    fetchRecentScans();
    fetchStats();
  }, []);

  const fetchRecentScans = async () => {
    try {
      const response = await apiRequest('GET', '/api/scanner/recent-scans?limit=5');
      setRecentScans(response.data);
    } catch (error) {
      console.error('Failed to fetch recent scans:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiRequest('GET', '/api/scanner/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch scanner stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResult = async (scan: ScanResult) => {
    try {
      const response = await apiRequest('GET', `/api/scanner/scan-details/${scan.id}`);
      setSelectedScan(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch scan details:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Content header with title and action button */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:truncate sm:text-3xl">
              Overview
            </h2>
          </div>
          <div className="mt-4 flex space-x-3 md:ml-4 md:mt-0">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="mt-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-blue-100 dark:bg-blue-900/30 p-3">
                    <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        Scans This Month
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {loading ? '...' : stats.scansThisMonth}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-green-100 dark:bg-green-900/30 p-3">
                    <Layers className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        Total Scans
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {loading ? '...' : stats.totalScans}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-indigo-100 dark:bg-indigo-900/30 p-3">
                    <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        Pages Scanned
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {loading ? '...' : stats.pagesScanned}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-purple-100 dark:bg-purple-900/30 p-3">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                        Team Members
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {loading ? '...' : stats.teamMembers}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-700 sm:grid-cols-2 sm:divide-x sm:divide-y-0 md:grid-cols-4">
              <Link
                to="/my-account/settings"
                className="flex flex-col items-center p-6 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Settings className="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Settings</span>
              </Link>
              <Link
                to="/my-account/billing"
                className="flex flex-col items-center p-6 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <FileText className="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Billing History</span>
              </Link>
              <Link
                to="/my-account/alerts"
                className="flex flex-col items-center p-6 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Bell className="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Notifications</span>
              </Link>
              <Link
                to="/my-account/team"
                className="flex flex-col items-center p-6 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Users className="mb-3 h-8 w-8 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">Team Management</span>
              </Link>
            </div>
          </div>

          {/* Recent Scans */}
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Recent Scans</h3>
                <Link
                  to="/my-account/monitoring"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-6">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <li className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="animate-pulse">
                          <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                        </div>
                        <div className="flex-1 animate-pulse">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    </li>
                  ) : recentScans.length === 0 ? (
                    <li className="py-8 text-center">
                      <Globe className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No scans yet</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Start monitoring your sites to see scan results here.
                      </p>
                      <div className="mt-6">
                        <Link
                          to="/my-account/monitoring"
                          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                        >
                          <Globe className="mr-1.5 h-4 w-4" />
                          Add Site Connection
                        </Link>
                      </div>
                    </li>
                  ) : (
                    recentScans.map((scan: ScanResult) => (
                      <li key={scan.id} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                              {scan.siteName || scan.url}
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(scan.createdAt)} - {scan.errorCount + scan.warningCount} issues • Score: <span className={getScoreColor(scan.score)}>{scan.score}%</span>
                            </p>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleViewResult(scan)}
                              className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2.5 py-1.5 text-sm font-medium leading-5 text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                              View Report
                            </button>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Current Plan */}
          <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Your Subscription</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{subscription.plan}</h4>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Status: <span className="font-medium text-green-600 dark:text-green-400">{subscription.status}</span>
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Next billing: {format(subscription.nextBilling, 'MMMM d, yyyy')}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Payment method: {subscription.paymentMethod}
                  </p>
                </div>
                <div>
                  <Link
                    to="/my-account/billing"
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 dark:bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Manage Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scan Result Modal */}
      <ScanResultModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        scanResult={selectedScan}
      />
    </div>
  );
}
