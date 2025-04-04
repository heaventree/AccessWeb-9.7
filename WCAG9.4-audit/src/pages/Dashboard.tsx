import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Activity, AlertTriangle, BarChart2, Calendar, Clock, FileText, Monitor, RefreshCw, Settings } from 'lucide-react';

/**
 * Dashboard page with Noble UI inspired design
 */
export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="flex space-x-3">
          <Button variant="outline" leftIcon={<RefreshCw size={16} />}>
            Refresh
          </Button>
          <Button leftIcon={<Settings size={16} />}>Settings</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="bg-gradient-to-br from-primary-500 to-primary-700 text-white" 
          title="45" 
          subtitle="Active Scans"
          icon={<Activity className="w-8 h-8" />}
        />

        <Card 
          className="bg-gradient-to-br from-secondary-500 to-secondary-700 text-white" 
          title="156" 
          subtitle="Total Scans This Month"
          icon={<BarChart2 className="w-8 h-8" />}
        />

        <Card 
          className="bg-gradient-to-br from-info-500 to-info-700 text-white" 
          title="225" 
          subtitle="Pages Scanned"
          icon={<FileText className="w-8 h-8" />}
        />

        <Card 
          className="bg-gradient-to-br from-success-500 to-success-700 text-white" 
          title="3" 
          subtitle="Team Members"
          icon={<Monitor className="w-8 h-8" />}
        />
      </div>

      {/* Quick Actions */}
      <Card 
        title="Quick Actions"
        className="mb-6"
      >
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button isFullWidth className="flex flex-col items-center py-4" variant="ghost">
              <Settings className="w-8 h-8 mb-2" />
              <span>Settings</span>
            </Button>
            <Button isFullWidth className="flex flex-col items-center py-4" variant="ghost">
              <FileText className="w-8 h-8 mb-2" />
              <span>Reports</span>
            </Button>
            <Button isFullWidth className="flex flex-col items-center py-4" variant="ghost">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <span>Alerts</span>
            </Button>
            <Button isFullWidth className="flex flex-col items-center py-4" variant="ghost">
              <Calendar className="w-8 h-8 mb-2" />
              <span>Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card title="Recent Scans" action={<Button size="sm" variant="outline">View All</Button>}>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Issues</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">https://example.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Feb 28, 2024</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">12 issues</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <Button size="sm" variant="link">View Report</Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">https://test.com</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Feb 27, 2024</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">5 issues</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <Button size="sm" variant="link">View Report</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" size="sm">Load More</Button>
        </CardFooter>
      </Card>
    </div>
  );
}