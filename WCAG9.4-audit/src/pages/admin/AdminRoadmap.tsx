import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { HeadingSection } from '../../components/ui/HeadingSection';

interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  targetDate: string;
}

export function AdminRoadmap() {
  const roadmapItems: RoadmapItem[] = [
    {
      id: 1,
      title: "Improve Section Identifiers visual styling",
      description: "Enhance the visual appearance of section identifiers to make them more visible and provide better contrast against different background colors.",
      status: "completed",
      priority: "medium",
      category: "UI/UX",
      targetDate: "2023-04-01"
    },
    {
      id: 2,
      title: "Add persistence to Section Identifiers across page navigation",
      description: "Ensure that section identifiers maintain consistent IDs when users navigate between different pages of the application.",
      status: "completed",
      priority: "high",
      category: "Performance",
      targetDate: "2023-04-15"
    },
    {
      id: 3,
      title: "Enhance WCAG Color Palette Generator with 2.2 standards",
      description: "Update the color palette generator to support the latest WCAG 2.2 standards and provide more comprehensive contrast information.",
      status: "completed",
      priority: "high",
      category: "Accessibility",
      targetDate: "2023-03-30"
    },
    {
      id: 4,
      title: "WordPress Integration Dashboard",
      description: "Create an intuitive dashboard for WordPress integration that provides real-time accessibility status and actionable insights.",
      status: "in-progress",
      priority: "high",
      category: "Integrations",
      targetDate: "2023-05-15"
    },
    {
      id: 5,
      title: "Shopify App Integration",
      description: "Develop a seamless integration with Shopify to scan and identify accessibility issues in Shopify stores.",
      status: "in-progress",
      priority: "high",
      category: "Integrations",
      targetDate: "2023-05-20"
    },
    {
      id: 6,
      title: "Mobile Navigation Improvements",
      description: "Enhance the mobile navigation experience with better touch targets and improved menu accessibility.",
      status: "planned",
      priority: "medium",
      category: "UI/UX",
      targetDate: "2023-06-10"
    },
    {
      id: 7,
      title: "AI-Powered Issue Resolution",
      description: "Implement AI capabilities to provide intelligent suggestions for fixing identified accessibility issues.",
      status: "planned",
      priority: "high",
      category: "AI/ML",
      targetDate: "2023-07-01"
    },
    {
      id: 8,
      title: "Accessibility Report PDF Export",
      description: "Enable exporting comprehensive accessibility reports in PDF format with branding options.",
      status: "planned",
      priority: "medium",
      category: "Reporting",
      targetDate: "2023-06-15"
    }
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <HeadingSection 
        title="Roadmap Items" 
        description="Track the development progress of features and improvements for AccessWeb." 
        className="mb-8"
      />

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="px-4 py-2 bg-primary-500 text-white rounded-md">All Items</button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">Planned</button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">In Progress</button>
        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md">Completed</button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmapItems.map((item) => (
          <Card key={item.id} className="overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className={`h-2 ${
              item.status === 'completed' ? 'bg-green-500' : 
              item.status === 'in-progress' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  item.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{item.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Target: {item.targetDate}</span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                  item.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                  item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {item.status === 'in-progress' ? 'In Progress' : 
                   item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}