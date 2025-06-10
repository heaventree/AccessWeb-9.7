import React, { useState, useEffect } from 'react';
import apiClient from '../lib/apiClient';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import {
  Activity,
  Clock,
  Globe,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ScanResultModal from './ScanResultModal';

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
  scanReason?: string;
}

interface SiteConnection {
  id: number;
  siteName: string;
  siteUrl: string;
  isActive: boolean;
  autoScanEnabled: boolean;
  scanFrequency: string;
  lastScanAt: string | null;
  apiToken?: string;
  platform: string;
}

export function MonitoringDashboard() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [connections, setConnections] = useState<SiteConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalScans, setTotalScans] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
  }, [currentPage, filter, sortBy]);

  const loadData = async () => {
    try {
      // Load paginated scan results
      const scansResponse = await apiClient.get(`/scanner/recent-scans?page=${currentPage}&limit=${itemsPerPage}&filter=${filter}&sort=${sortBy}`);
      setScans(scansResponse.data?.data || []);
      setTotalPages(scansResponse.data?.pagination?.totalPages || 1);
      setTotalScans(scansResponse.data?.pagination?.total || 0);

      // Load site connections (if the endpoint exists)
      try {
        const connectionsResponse = await apiClient.get('/site-connections');
        const connectionsData = connectionsResponse.data?.data || [];
        console.log('Loaded site connections:', connectionsData);
        setConnections(connectionsData);
      } catch (error) {
        console.error('Failed to load connections:', error);
        setConnections([]);
      }
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
      toast.error('Failed to load monitoring data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = async (scan: ScanResult) => {
    try {
      const response = await apiClient.get(`/scanner/scan-details/${scan.id}`);
      setSelectedScan(response.data.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch scan details:', error);
      toast.error('Failed to load scan details');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Filter and sort scans
  const filteredScans = scans.filter(scan => {
    if (filter === 'all') return true;
    if (filter === 'errors' && scan.errorCount > 0) return true;
    if (filter === 'warnings' && scan.warningCount > 0) return true;
    if (filter === 'passed' && scan.errorCount === 0 && scan.warningCount === 0) return true;
    return false;
  });

  const sortedScans = filteredScans.sort((a, b) => {
    if (sortBy === 'timestamp') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'issues') return b.issues - a.issues;
    return 0;
  });

  // Process data for charts
  const chartData = scans.reduce((acc, scan) => {
    const date = new Date(scan.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { date, scans: 0, avgScore: 0, totalErrors: 0, totalWarnings: 0 };
    }
    acc[date].scans++;
    acc[date].avgScore = ((acc[date].avgScore * (acc[date].scans - 1)) + scan.score) / acc[date].scans;
    acc[date].totalErrors += scan.errorCount;
    acc[date].totalWarnings += scan.warningCount;
    return acc;
  }, {} as Record<string, { date: string; scans: number; avgScore: number; totalErrors: number; totalWarnings: number; }>);

  const chartDataArray = Object.values(chartData);

  // Calculate summary stats
  const displayTotalScans = totalScans || scans.length;
  const avgScore = scans.length > 0 ? scans.reduce((sum, scan) => sum + scan.score, 0) / scans.length : 0;
  const totalErrors = scans.reduce((sum, scan) => sum + scan.errorCount, 0);
  const totalWarnings = scans.reduce((sum, scan) => sum + scan.warningCount, 0);
  const activeConnections = connections.filter(conn => conn.isActive && conn.autoScanEnabled).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Scans</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {displayTotalScans}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Score</p>
              <p className={`text-2xl font-semibold ${getScoreColor(avgScore)} dark:text-gray-100`}>
                {avgScore.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Issues</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {totalErrors + totalWarnings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sites</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {activeConnections}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      {chartDataArray.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Accessibility Score Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartDataArray}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgScore" stroke="#10b981" name="Avg Score" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Issues Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartDataArray}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalErrors" fill="#ef4444" name="Errors" />
                  <Bar dataKey="totalWarnings" fill="#f59e0b" name="Warnings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">All Scan Results</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Results</option>
                <option value="errors">With Errors</option>
                <option value="warnings">With Warnings</option>
                <option value="passed">Passed</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="timestamp">Date</option>
                <option value="score">Score</option>
                <option value="issues">Issues</option>
              </select>
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>

        {/* Scan Results Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Site
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Issues
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedScans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Globe className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No scans found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      No scan results match the current filter criteria.
                    </p>
                  </td>
                </tr>
              ) : (
                sortedScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {scan.siteName || new URL(scan.url).hostname}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {scan.url}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBadgeColor(scan.score)}`}>
                        {scan.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center space-x-2">
                        {scan.errorCount > 0 && (
                          <span className="inline-flex items-center text-red-600 dark:text-red-400">
                            <XCircle className="w-4 h-4 mr-1" />
                            {scan.errorCount}
                          </span>
                        )}
                        {scan.warningCount > 0 && (
                          <span className="inline-flex items-center text-yellow-600 dark:text-yellow-400">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            {scan.warningCount}
                          </span>
                        )}
                        {scan.errorCount === 0 && scan.warningCount === 0 && (
                          <span className="inline-flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            None
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {scan.scanDuration ? `${(scan.scanDuration / 1000).toFixed(1)}s` : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        scan.scanStatus === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {scan.scanStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewReport(scan)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scan Result Modal */}
      {selectedScan && (
        <ScanResultModal
          scanResult={selectedScan}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}