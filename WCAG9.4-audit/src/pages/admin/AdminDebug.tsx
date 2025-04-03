import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { HeadingSection } from '../../components/ui/HeadingSection';

interface DebugItem {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'wont-fix';
  severity: 'low' | 'medium' | 'high' | 'critical';
  component: string;
  createdDate: string;
  updatedDate: string;
}

export function AdminDebug() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const debugItems: DebugItem[] = [
    {
      id: 1,
      title: "Section Identifiers disappear during page navigation",
      description: "When navigating between pages, the section identifiers are not persisting correctly, causing IDs to change or disappear.",
      status: "resolved",
      severity: "high",
      component: "Section Identifiers",
      createdDate: "2023-03-20",
      updatedDate: "2023-04-01"
    },
    {
      id: 2,
      title: "Section Identifiers overlapping with navigation menu",
      description: "The identifiers for navigation elements are positioned incorrectly and overlap with the menu items, making them difficult to read.",
      status: "resolved",
      severity: "medium",
      component: "Section Identifiers",
      createdDate: "2023-03-22",
      updatedDate: "2023-04-02"
    },
    {
      id: 3,
      title: "Mobile navigation menu is difficult to use on small screens",
      description: "The mobile navigation menu has touch targets that are too small and the dropdown behavior is inconsistent on different devices.",
      status: "open",
      severity: "high",
      component: "Navigation",
      createdDate: "2023-03-25",
      updatedDate: "2023-03-25"
    },
    {
      id: 4,
      title: "WCAG Color Palette doesn't handle alpha transparency correctly",
      description: "When calculating contrast ratios for colors with alpha transparency, the results are incorrect and can lead to false positives/negatives.",
      status: "in-progress",
      severity: "medium",
      component: "WCAG Color Palette",
      createdDate: "2023-03-28",
      updatedDate: "2023-04-05"
    },
    {
      id: 5,
      title: "WordPress integration fails with custom permalinks",
      description: "When WordPress sites use custom permalink structures, the integration script fails to properly identify and scan all pages.",
      status: "in-progress",
      severity: "high",
      component: "WordPress Integration",
      createdDate: "2023-04-01",
      updatedDate: "2023-04-10"
    },
    {
      id: 6,
      title: "Dark mode colors have insufficient contrast in some components",
      description: "Several UI components don't adjust their colors properly in dark mode, resulting in text that's difficult to read.",
      status: "open",
      severity: "medium",
      component: "Theme System",
      createdDate: "2023-04-02",
      updatedDate: "2023-04-02"
    },
    {
      id: 7,
      title: "Error messages not being read by screen readers",
      description: "Form validation error messages are not properly announced by screen readers, making it difficult for users to identify and fix submission errors.",
      status: "open",
      severity: "critical",
      component: "Forms",
      createdDate: "2023-04-05",
      updatedDate: "2023-04-05"
    },
    {
      id: 8,
      title: "Memory leak in Section Identifiers component",
      description: "The Section Identifiers component is not properly cleaning up event listeners, causing memory usage to increase over time.",
      status: "resolved",
      severity: "critical",
      component: "Section Identifiers",
      createdDate: "2023-03-15",
      updatedDate: "2023-04-08"
    }
  ];

  const filteredItems = statusFilter === 'all' 
    ? debugItems 
    : debugItems.filter(item => item.status === statusFilter);

  return (
    <div className="container mx-auto py-6 px-4">
      <HeadingSection 
        title="Debug List" 
        description="Track and manage bugs and issues within the AccessWeb platform." 
        className="mb-8"
      />

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button 
          className={`px-4 py-2 rounded-md ${statusFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          onClick={() => setStatusFilter('all')}
        >
          All Issues
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${statusFilter === 'open' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          onClick={() => setStatusFilter('open')}
        >
          Open
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${statusFilter === 'in-progress' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          onClick={() => setStatusFilter('in-progress')}
        >
          In Progress
        </button>
        <button 
          className={`px-4 py-2 rounded-md ${statusFilter === 'resolved' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          onClick={() => setStatusFilter('resolved')}
        >
          Resolved
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className={`h-2 ${
              item.severity === 'critical' ? 'bg-red-600' : 
              item.severity === 'high' ? 'bg-orange-500' : 
              item.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            <CardContent className="p-5">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <div className="flex gap-2">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    item.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                    item.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 
                    item.severity === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    item.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                    item.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                    item.status === 'wont-fix' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : 
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {item.status === 'in-progress' ? 'In Progress' : 
                     item.status === 'wont-fix' ? "Won't Fix" :
                     item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{item.description}</p>
              <div className="flex flex-wrap justify-between items-center text-sm gap-2">
                <span className="text-gray-500 dark:text-gray-400">Component: <span className="font-medium text-gray-700 dark:text-gray-300">{item.component}</span></span>
                <div className="flex gap-4">
                  <span className="text-gray-500 dark:text-gray-400">Created: {item.createdDate}</span>
                  <span className="text-gray-500 dark:text-gray-400">Updated: {item.updatedDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}