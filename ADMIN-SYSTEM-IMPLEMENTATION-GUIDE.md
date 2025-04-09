# WCAG Admin Project Management System Implementation Guide

This comprehensive guide outlines how to replicate the WCAG Admin Project Management System from the WCAG9.4-audit application in another project. The system consists of three key dashboards: Roadmap, Debug, and Completion, which together provide a complete project management solution for tracking development progress, issues, and overall completion status.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Required Dependencies](#required-dependencies)
3. [Core Components Implementation](#core-components-implementation)
4. [Data Models](#data-models)
5. [Routes Setup](#routes-setup)
6. [UI Components](#ui-components)
7. [Page Components](#page-components)
8. [Layouts](#layouts)
9. [Step-by-Step Implementation Guide](#step-by-step-implementation-guide)
10. [Customization Options](#customization-options)

## Project Structure

The admin system relies on the following directory structure:

```
src/
├── components/
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── HeadingSection.tsx
│   │   ├── Progress.tsx
│   │   └── index.ts
├── data/
│   ├── roadmapData.ts
│   └── debugData.ts
├── layouts/
│   ├── AdminLayout.tsx
│   └── DashboardLayout.tsx
├── pages/
│   ├── admin/
│   │   ├── AdminRoadmap.tsx
│   │   ├── AdminDebug.tsx
│   │   └── CompletionDashboard.tsx
├── App.tsx (or routing configuration file)
└── ...
```

## Required Dependencies

These dependencies are necessary to implement the admin system:

- React (v17 or higher)
- React Router (v6 or higher)
- Tailwind CSS
- Lucide React (for icons)
- TypeScript (recommended but optional)

## Core Components Implementation

### 1. UI Components

The admin system uses three primary UI components:

#### Card.tsx
This component renders content within a styled container, with options for headers, footers, and different styles.

```tsx
// src/components/ui/Card.tsx
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
  bordered?: boolean;
  id?: string;
}

export function Card({ 
  children, 
  className = "", 
  onClick,
  title,
  subtitle,
  icon,
  action,
  bordered = false,
  id
}: CardProps) {
  const hasHeader = title || subtitle || icon || action;
  const titleId = id ? `${id}-title` : title ? title.toLowerCase().replace(/\s+/g, '-') : undefined;
  const subtitleId = titleId ? `${titleId}-subtitle` : undefined;
  
  return (
    <div 
      className={`bg-white dark:bg-gray-800 shadow rounded-lg ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''} ${className}`}
      onClick={onClick}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={subtitle ? subtitleId : undefined}
      tabIndex={onClick ? 0 : undefined}
      id={id}
    >
      {hasHeader && (
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            {icon && <span className="mr-2 text-primary-500" aria-hidden="true">{icon}</span>}
            <div>
              {title && <h3 id={titleId} className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>}
              {subtitle && <p id={subtitleId} className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`border-t border-gray-200 dark:border-gray-700 px-4 py-3 ${className}`}>
      {children}
    </div>
  );
}
```

#### HeadingSection.tsx
This component renders page titles and descriptions with proper accessibility attributes.

```tsx
// src/components/ui/HeadingSection.tsx
interface HeadingSectionProps {
  title: string;
  description?: string;
  className?: string;
}

export function HeadingSection({ title, description, className = "" }: HeadingSectionProps) {
  const headingId = title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`${className}`}>
      <h1 
        id={headingId} 
        className="text-2xl font-bold text-gray-900 dark:text-white"
      >
        {title}
      </h1>
      {description && (
        <p 
          className="mt-1 text-sm text-gray-500 dark:text-gray-400"
          id={`${headingId}-description`}
          aria-labelledby={headingId}
        >
          {description}
        </p>
      )}
    </div>
  );
}
```

#### Progress.tsx
This component renders progress bars with accessibility attributes.

```tsx
// src/components/ui/Progress.tsx
import type { CSSProperties } from 'react';

interface ProgressProps {
  value: number;
  max: number;
  className?: string;
  barClassName?: string;
  style?: CSSProperties;
  label?: string;
  id?: string;
}

export function Progress({ 
  value, 
  max, 
  className = "", 
  barClassName = "",
  style,
  label,
  id
}: ProgressProps) {
  const percentage = Math.round((value / max) * 100);
  const progressId = id || `progress-${Math.random().toString(36).substring(2, 9)}`;
  const ariaLabel = label || `${percentage}% complete`;
  
  return (
    <div 
      className={`bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}
      role="progressbar" 
      aria-valuenow={value} 
      aria-valuemin={0} 
      aria-valuemax={max}
      aria-label={ariaLabel}
      id={progressId}
      data-percentage={`${percentage}%`}
    >
      <div 
        className={`h-full rounded-full bg-blue-600 transition-all duration-300 ease-in-out ${barClassName}`}
        style={{ width: `${percentage}%`, ...style }}
      />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
```

## Data Models

The admin system uses two main data model files:

### roadmapData.ts
This file defines the roadmap feature types and data.

```typescript
// src/data/roadmapData.ts
export type FeatureStatus = 'planned' | 'in-progress' | 'completed' | 'deferred';

export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  priority: number; // 1 (highest) to 5 (lowest)
  category: 'core' | 'ui' | 'reporting' | 'integration' | 'analytics';
  dependencies?: string[]; // IDs of features this depends on
  estimatedCompletionDate?: string;
  completedDate?: string;
}

export const roadmapFeatures: RoadmapFeature[] = [
  // Example entries
  {
    id: 'feature-1',
    title: 'User Authentication',
    description: 'Implement user authentication system with login/signup',
    status: 'completed',
    priority: 1,
    category: 'core',
    completedDate: '2023-03-15'
  },
  {
    id: 'feature-2',
    title: 'Dashboard UI',
    description: 'Design and implement main dashboard interface',
    status: 'in-progress',
    priority: 1,
    category: 'ui',
    estimatedCompletionDate: '2023-04-10'
  },
  // Add your own features here
];

// Helper functions
export function getFeaturesByStatus(status: FeatureStatus): RoadmapFeature[] {
  return roadmapFeatures.filter(feature => feature.status === status)
    .sort((a, b) => a.priority - b.priority);
}

export function getFeaturesByCategory(category: RoadmapFeature['category']): RoadmapFeature[] {
  return roadmapFeatures.filter(feature => feature.category === category)
    .sort((a, b) => a.priority - b.priority);
}

export function getNextFeatures(count: number = 3): RoadmapFeature[] {
  // Get planned features where dependencies are satisfied
  const plannedFeatures = roadmapFeatures.filter(f => f.status === 'planned');
  const completedFeatureIds = roadmapFeatures
    .filter(f => f.status === 'completed')
    .map(f => f.id);
  
  const implementableFeatures = plannedFeatures.filter(feature => {
    if (!feature.dependencies || feature.dependencies.length === 0) return true;
    return feature.dependencies.every(depId => completedFeatureIds.includes(depId));
  });
  
  return implementableFeatures
    .sort((a, b) => a.priority - b.priority)
    .slice(0, count);
}
```

### debugData.ts
This file defines the debug item types and data.

```typescript
// src/data/debugData.ts
export type DebugItemCategory = 
  | 'ui' 
  | 'core' 
  | 'api' 
  | 'integration' 
  | 'performance' 
  | 'security' 
  | 'monitoring'
  | 'accessibility'
  | 'data'
  | 'subscription'
  | 'alerts'
  | 'policies';

export type DebugItemStatus = 
  | 'identified' 
  | 'investigating' 
  | 'in-progress' 
  | 'testing' 
  | 'resolved' 
  | 'deferred';

export type DebugItemPriority = 
  | 'critical'  // Must fix immediately, blocking deployment
  | 'high'      // Important to fix soon, causes significant user impact
  | 'medium'    // Should fix in current sprint
  | 'low'       // Fix when possible, minor impact
  | 'very-low'; // Nice to have, minimal impact

export interface DebugItem {
  id: string;
  title: string;
  description: string;
  category: DebugItemCategory;
  status: DebugItemStatus;
  priority: DebugItemPriority;
  dateIdentified: string;
  assignedTo?: string;
  relatedIssues?: string[];
  todoItems?: string[];
  notes?: string;
}

export const debugItems: DebugItem[] = [
  // Example entries
  {
    id: 'debug-001',
    title: 'Login Form Validation',
    description: 'Form validation fails with certain special characters',
    category: 'ui',
    status: 'in-progress',
    priority: 'high',
    dateIdentified: '2023-03-10',
    assignedTo: 'John Doe',
    todoItems: [
      'Fix validation regex',
      'Add proper error messages',
      'Implement client-side validation'
    ],
    notes: 'This is causing login failures for users with apostrophes in their names.'
  },
  // Add your own debug items here
];

// Helper functions
export function getDebugItemsByStatus(status: DebugItemStatus): DebugItem[] {
  return debugItems.filter(item => item.status === status);
}

export function getDebugItemsByCategory(category: DebugItemCategory): DebugItem[] {
  return debugItems.filter(item => item.category === category);
}

export function getDebugItemsByPriority(priority: DebugItemPriority): DebugItem[] {
  return debugItems.filter(item => item.priority === priority);
}

export function getHighPriorityDebugItems(): DebugItem[] {
  return debugItems.filter(item => item.priority === 'critical' || item.priority === 'high');
}
```

## Page Components

### AdminRoadmap.tsx
The roadmap page displays the status of all features, allowing filtering by status and category.

```tsx
// src/pages/admin/AdminRoadmap.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { HeadingSection } from '../../components/ui/HeadingSection';
import { roadmapFeatures, FeatureStatus, RoadmapFeature, getFeaturesByStatus, getFeaturesByCategory, getNextFeatures } from '../../data/roadmapData';

export function AdminRoadmap() {
  const [statusFilter, setStatusFilter] = useState<FeatureStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Filter items based on selected filters
  const filteredItems = roadmapFeatures
    .filter(item => statusFilter === 'all' || item.status === statusFilter)
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .sort((a, b) => a.priority - b.priority);

  // Get category counts
  const categories = ['core', 'ui', 'reporting', 'integration', 'analytics'];
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = roadmapFeatures.filter(item => item.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  // Get status counts
  const statuses: FeatureStatus[] = ['planned', 'in-progress', 'completed', 'deferred'];
  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = roadmapFeatures.filter(item => item.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  // Get the next features to implement
  const nextFeatures = getNextFeatures(3);

  // Helper functions for formatting and colors
  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      'core': 'Core',
      'ui': 'UI/UX',
      'reporting': 'Reporting',
      'integration': 'Integration',
      'analytics': 'Analytics'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getPriorityLabel = (priority: number): string => {
    if (priority === 1) return 'Critical';
    if (priority === 2) return 'High';
    if (priority === 3) return 'Medium';
    if (priority === 4) return 'Low';
    return 'Very Low';
  };

  const getPriorityColor = (priority: number): string => {
    if (priority === 1) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (priority === 2) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    if (priority === 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (priority === 4) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const getStatusColor = (status: FeatureStatus): string => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'in-progress') return 'bg-yellow-500';
    if (status === 'planned') return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getStatusBadgeClass = (status: FeatureStatus): string => {
    if (status === 'completed') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (status === 'in-progress') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (status === 'planned') return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatStatus = (status: FeatureStatus): string => {
    if (status === 'in-progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <HeadingSection 
        title="Roadmap Items" 
        description="Track the development progress of features and improvements." 
        className="mb-8"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Total Features</h3>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">{roadmapFeatures.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 dark:text-green-300">Completed</h3>
            <p className="text-3xl font-bold text-green-900 dark:text-green-200">{statusCounts['completed'] || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-200">{statusCounts['in-progress'] || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 border-purple-200 dark:border-purple-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-purple-800 dark:text-purple-300">Planned</h3>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-200">{statusCounts['planned'] || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Next Features */}
      {nextFeatures.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Next Up for Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nextFeatures.map(feature => (
              <Card key={feature.id} className="border-2 border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-200">{feature.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(feature.priority)}`}>
                      {getPriorityLabel(feature.priority)}
                    </span>
                  </div>
                  <p className="text-primary-800 dark:text-primary-300 text-sm mb-3">{feature.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200">
                      {getCategoryLabel(feature.category)}
                    </span>
                    <span className="text-xs text-primary-700 dark:text-primary-400">
                      Ready to implement
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <h3 className="w-full text-lg font-semibold text-gray-900 dark:text-white mb-2">Filter by Status</h3>
          <button 
            className={`px-4 py-2 rounded-md ${statusFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setStatusFilter('all')}
          >
            All Items ({roadmapFeatures.length})
          </button>
          {statuses.map(status => (
            <button 
              key={status}
              className={`px-4 py-2 rounded-md ${statusFilter === status ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setStatusFilter(status)}
            >
              {formatStatus(status)} ({statusCounts[status] || 0})
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <h3 className="w-full text-lg font-semibold text-gray-900 dark:text-white mb-2">Filter by Category</h3>
          <button 
            className={`px-4 py-2 rounded-md ${categoryFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setCategoryFilter('all')}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button 
              key={category}
              className={`px-4 py-2 rounded-md ${categoryFilter === category ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setCategoryFilter(category)}
            >
              {getCategoryLabel(category)} ({categoryCounts[category] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className={`h-2 ${getStatusColor(item.status)}`} />
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                  {getPriorityLabel(item.priority)}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{item.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  {item.status === 'completed' && item.completedDate ? `Completed: ${item.completedDate}` : 
                   item.estimatedCompletionDate ? `Target: ${item.estimatedCompletionDate}` : 
                   `Category: ${getCategoryLabel(item.category)}`}
                </span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeClass(item.status)}`}>
                  {formatStatus(item.status)}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-lg text-gray-500 dark:text-gray-400">No features found matching the selected filters.</p>
        </div>
      )}
    </div>
  );
}
```

### AdminDebug.tsx
The debug page displays all current issues and bugs, with filtering options.

```tsx
// src/pages/admin/AdminDebug.tsx
import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { HeadingSection } from '../../components/ui/HeadingSection';
import { debugItems, DebugItem, DebugItemCategory, DebugItemPriority, DebugItemStatus } from '../../data/debugData';

export function AdminDebug() {
  const [statusFilter, setStatusFilter] = useState<DebugItemStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<DebugItemCategory | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<DebugItemPriority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items based on selected filters and search query
  const filteredItems = debugItems
    .filter(item => statusFilter === 'all' || item.status === statusFilter)
    .filter(item => categoryFilter === 'all' || item.category === categoryFilter)
    .filter(item => priorityFilter === 'all' || item.priority === priorityFilter)
    .filter(item => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.todoItems?.some(todo => todo.toLowerCase().includes(query))) ||
        (item.notes?.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3, 'very-low': 4 };
      return (priorityOrder[a.priority] ?? 999) - (priorityOrder[b.priority] ?? 999);
    });

  // Get category counts
  const categories: DebugItemCategory[] = ['ui', 'core', 'api', 'integration', 'performance', 'security', 'monitoring', 'accessibility', 'data', 'subscription', 'alerts', 'policies'];
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = debugItems.filter(item => item.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  // Get status counts
  const statuses: DebugItemStatus[] = ['identified', 'investigating', 'in-progress', 'testing', 'resolved', 'deferred'];
  const statusCounts = statuses.reduce((acc, status) => {
    acc[status] = debugItems.filter(item => item.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  // Get priority counts
  const priorities: DebugItemPriority[] = ['critical', 'high', 'medium', 'low', 'very-low'];
  const priorityCounts = priorities.reduce((acc, priority) => {
    acc[priority] = debugItems.filter(item => item.priority === priority).length;
    return acc;
  }, {} as Record<string, number>);

  // Helper functions for formatting
  const getCategoryLabel = (category: DebugItemCategory): string => {
    const labels: Record<DebugItemCategory, string> = {
      'ui': 'UI/UX',
      'core': 'Core',
      'api': 'API',
      'integration': 'Integration',
      'performance': 'Performance',
      'security': 'Security',
      'monitoring': 'Monitoring',
      'accessibility': 'Accessibility',
      'data': 'Data',
      'subscription': 'Subscription',
      'alerts': 'Alerts',
      'policies': 'Policies'
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getStatusLabel = (status: DebugItemStatus): string => {
    const labels: Record<DebugItemStatus, string> = {
      'identified': 'Identified',
      'investigating': 'Investigating',
      'in-progress': 'In Progress',
      'testing': 'Testing',
      'resolved': 'Resolved',
      'deferred': 'Deferred'
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: DebugItemPriority): string => {
    const labels: Record<DebugItemPriority, string> = {
      'critical': 'Critical',
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low',
      'very-low': 'Very Low'
    };
    return labels[priority];
  };

  const getCategoryColor = (category: DebugItemCategory): string => {
    const colors: Record<DebugItemCategory, string> = {
      'ui': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'core': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      'api': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'integration': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
      'performance': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
      'security': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'monitoring': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'accessibility': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'data': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'subscription': 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
      'alerts': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'policies': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
    };
    return colors[category];
  };

  const getStatusColor = (status: DebugItemStatus): string => {
    const colors: Record<DebugItemStatus, string> = {
      'identified': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'investigating': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'testing': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'deferred': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: DebugItemPriority): string => {
    const colors: Record<DebugItemPriority, string> = {
      'critical': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'very-low': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return colors[priority];
  };

  const getStatusIndicatorColor = (status: DebugItemStatus): string => {
    const colors: Record<DebugItemStatus, string> = {
      'identified': 'bg-blue-500',
      'investigating': 'bg-purple-500',
      'in-progress': 'bg-yellow-500',
      'testing': 'bg-orange-500',
      'resolved': 'bg-green-500',
      'deferred': 'bg-gray-500'
    };
    return colors[status];
  };

  const renderDebugCard = (item: DebugItem) => {
    return (
      <Card key={item.id} className="overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className={`h-2 ${getStatusIndicatorColor(item.status)}`} />
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
              {getPriorityLabel(item.priority)}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{item.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryColor(item.category)}`}>
              {getCategoryLabel(item.category)}
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-md ${getStatusColor(item.status)}`}>
              {getStatusLabel(item.status)}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
              {item.dateIdentified}
            </span>
          </div>
          
          {item.assignedTo && (
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-xs text-primary-800 dark:text-primary-200 mr-2">
                {item.assignedTo.split(' ').map(n => n[0]).join('')}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">{item.assignedTo}</span>
            </div>
          )}
          
          {item.todoItems && item.todoItems.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">To Do:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {item.todoItems.slice(0, 3).map((todo, index) => (
                  <li key={index}>{todo}</li>
                ))}
                {item.todoItems.length > 3 && (
                  <li className="text-primary-600 dark:text-primary-400">+{item.todoItems.length - 3} more items</li>
                )}
              </ul>
            </div>
          )}
          
          {item.notes && (
            <div className="text-sm italic text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-2 mt-2">
              {item.notes}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <HeadingSection 
        title="Debug List" 
        description="Track and manage current development issues, bugs, and improvements in progress." 
        className="mb-8"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Total Issues</h3>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-200">{debugItems.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-orange-800 dark:text-orange-300">High Priority</h3>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-200">
              {debugItems.filter(item => item.priority === 'critical' || item.priority === 'high').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-200">{statusCounts['in-progress'] || 0}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 dark:text-green-300">Resolved</h3>
            <p className="text-3xl font-bold text-green-900 dark:text-green-200">{statusCounts['resolved'] || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search debug items..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/2 flex gap-2 overflow-x-auto pb-2">
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as DebugItemPriority | 'all')}
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {getPriorityLabel(priority)} ({priorityCounts[priority] || 0})
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DebugItemStatus | 'all')}
            >
              <option value="all">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {getStatusLabel(status)} ({statusCounts[status] || 0})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1 rounded-md text-sm ${categoryFilter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
            onClick={() => setCategoryFilter('all')}
          >
            All Categories
          </button>
          {categories.map(category => (
            <button 
              key={category}
              className={`px-3 py-1 rounded-md text-sm ${categoryFilter === category ? 'bg-primary-500 text-white' : `bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200`}`}
              onClick={() => setCategoryFilter(category)}
            >
              {getCategoryLabel(category)} ({categoryCounts[category] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Debug Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => renderDebugCard(item))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-lg text-gray-500 dark:text-gray-400">No debug items found matching the selected filters.</p>
        </div>
      )}
    </div>
  );
}
```

### CompletionDashboard.tsx
The completion dashboard shows overall project progress with categories and feature status.

```tsx
// src/pages/admin/CompletionDashboard.tsx
import { Card, HeadingSection, Progress } from '../../components/ui';

// Type definitions for our completion data
interface CategoryCompletion {
  name: string;
  percentage: number;
  color: string;
}

interface FeatureStatus {
  name: string;
  percentage: number;
  status: 'completed' | 'in-progress' | 'not-started' | 'critical';
}

// Data for the completion charts - Replace with your own data
const categoryCompletions: CategoryCompletion[] = [
  { name: 'Core Features', percentage: 65, color: '#4ade80' },
  { name: 'UI/UX Implementation', percentage: 70, color: '#3b82f6' },
  { name: 'Backend Systems', percentage: 50, color: '#f97316' },
  { name: 'Integrations', percentage: 45, color: '#8b5cf6' },
  { name: 'Documentation', percentage: 75, color: '#14b8a6' },
  { name: 'Testing & Bug Fixes', percentage: 55, color: '#f43f5e' },
];

// Data for feature completion status - Replace with your own data
const featureCompletions: FeatureStatus[] = [
  { name: 'User Authentication', percentage: 100, status: 'completed' },
  { name: 'Dashboard UI', percentage: 100, status: 'completed' },
  { name: 'API Integration', percentage: 100, status: 'completed' },
  { name: 'Data Models', percentage: 100, status: 'completed' },
  { name: 'Form Validation', percentage: 70, status: 'in-progress' },
  { name: 'Search Functionality', percentage: 60, status: 'in-progress' },
  { name: 'Analytics Engine', percentage: 40, status: 'in-progress' },
  { name: 'Admin Dashboard', percentage: 50, status: 'in-progress' },
  { name: 'Subscription System', percentage: 30, status: 'critical' },
  { name: 'Notification System', percentage: 20, status: 'critical' },
  { name: 'Export Functionality', percentage: 0, status: 'not-started' },
  { name: 'Mobile Responsiveness', percentage: 50, status: 'in-progress' },
];

// Critical issues list - Replace with your own data
const criticalIssues = [
  {
    title: 'Subscription System Issues',
    description: 'Missing functions and tables for subscription management'
  },
  {
    title: 'Authentication Implementation',
    description: 'Security concerns due to authentication bypass'
  },
  {
    title: 'Database Migration Issues',
    description: 'Migrations failing with column name errors'
  }
];

export default function CompletionDashboard() {
  // Calculate overall project completion
  const overallCompletion = Math.round(
    categoryCompletions.reduce((sum, category) => sum + category.percentage, 0) / categoryCompletions.length
  );
  
  // Count features by status
  const completedCount = featureCompletions.filter(f => f.status === 'completed').length;
  const inProgressCount = featureCompletions.filter(f => f.status === 'in-progress').length;
  const criticalCount = featureCompletions.filter(f => f.status === 'critical').length;
  
  return (
    <div className="container mx-auto py-6 px-4">
      <HeadingSection 
        title="Project Completion Dashboard" 
        description="Track the overall progress and status of project development." 
        className="mb-8"
      />
      
      {/* Overall Completion */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1 flex flex-col items-center justify-center p-6">
          <h3 className="text-lg font-medium mb-2">Overall Completion</h3>
          <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 100 100" aria-hidden="true">
              <circle 
                className="text-gray-200" 
                strokeWidth="10" 
                stroke="currentColor" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
              />
              <circle 
                className="text-blue-600" 
                strokeWidth="10" 
                strokeDasharray={250.8} 
                strokeDashoffset={250.8 - (overallCompletion / 100) * 250.8} 
                strokeLinecap="round" 
                stroke="currentColor" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
              />
            </svg>
            <span className="absolute text-3xl font-semibold">{overallCompletion}%</span>
          </div>
        </Card>
        
        <Card className="col-span-1 flex flex-col items-center justify-center p-6 bg-green-50">
          <div className="flex items-center mb-2">
            <div className="text-green-500 mr-2 text-xl" aria-hidden="true">✓</div>
            <h3 className="text-lg font-medium" id="completed-features">Completed</h3>
          </div>
          <p className="text-4xl font-bold text-green-600" aria-labelledby="completed-features">{completedCount}</p>
          <p className="text-sm text-gray-500 mt-2">Features</p>
        </Card>
        
        <Card className="col-span-1 flex flex-col items-center justify-center p-6 bg-blue-50">
          <div className="flex items-center mb-2">
            <div className="text-blue-500 mr-2 text-xl" aria-hidden="true">⏱</div>
            <h3 className="text-lg font-medium" id="in-progress-features">In Progress</h3>
          </div>
          <p className="text-4xl font-bold text-blue-600" aria-labelledby="in-progress-features">{inProgressCount}</p>
          <p className="text-sm text-gray-500 mt-2">Features</p>
        </Card>
        
        <Card className="col-span-1 flex flex-col items-center justify-center p-6 bg-red-50">
          <div className="flex items-center mb-2">
            <div className="text-red-500 mr-2 text-xl" aria-hidden="true">⚠</div>
            <h3 className="text-lg font-medium" id="critical-features">Critical Issues</h3>
          </div>
          <p className="text-4xl font-bold text-red-600" aria-labelledby="critical-features">{criticalCount}</p>
          <p className="text-sm text-gray-500 mt-2">Features</p>
        </Card>
      </div>
      
      {/* Category Completion */}
      <h2 className="text-xl font-semibold mb-4">Category Completion</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {categoryCompletions.map((category, index) => (
          <Card key={index} className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{category.name}</h3>
              <span className="font-semibold">{category.percentage}%</span>
            </div>
            <Progress 
              value={category.percentage} 
              max={100} 
              className="h-2 bg-gray-200 rounded-full overflow-hidden"
              barClassName={`h-full rounded-full`}
              style={{ backgroundColor: category.color }}
            />
          </Card>
        ))}
      </div>
      
      {/* Feature Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Feature Status</h2>
          <Card className="p-4">
            <div className="space-y-4">
              {featureCompletions
                .slice(0, Math.ceil(featureCompletions.length / 2))
                .map((feature, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      {feature.status === 'completed' && <span className="text-green-500 mr-2">✓</span>}
                      {feature.status === 'in-progress' && <span className="text-blue-500 mr-2">⏱</span>}
                      {feature.status === 'critical' && <span className="text-red-500 mr-2">⚠</span>}
                      {feature.status === 'not-started' && <span className="text-gray-500 mr-2">□</span>}
                      <span className={
                        feature.status === 'critical' ? 'text-red-700' :
                        feature.status === 'completed' ? 'text-green-700' : ''
                      }>
                        {feature.name}
                      </span>
                    </div>
                    <span className="font-semibold">{feature.percentage}%</span>
                  </div>
                  <Progress 
                    value={feature.percentage} 
                    max={100} 
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    barClassName={`h-full rounded-full ${
                      feature.status === 'completed' ? 'bg-green-500' :
                      feature.status === 'in-progress' ? 'bg-blue-500' :
                      feature.status === 'critical' ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">&nbsp;</h2>
          <Card className="p-4">
            <div className="space-y-4">
              {featureCompletions
                .slice(Math.ceil(featureCompletions.length / 2))
                .map((feature, index) => (
                <div key={index} className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      {feature.status === 'completed' && <span className="text-green-500 mr-2">✓</span>}
                      {feature.status === 'in-progress' && <span className="text-blue-500 mr-2">⏱</span>}
                      {feature.status === 'critical' && <span className="text-red-500 mr-2">⚠</span>}
                      {feature.status === 'not-started' && <span className="text-gray-500 mr-2">□</span>}
                      <span className={
                        feature.status === 'critical' ? 'text-red-700' :
                        feature.status === 'completed' ? 'text-green-700' : ''
                      }>
                        {feature.name}
                      </span>
                    </div>
                    <span className="font-semibold">{feature.percentage}%</span>
                  </div>
                  <Progress 
                    value={feature.percentage} 
                    max={100} 
                    className="h-2 bg-gray-200 rounded-full overflow-hidden"
                    barClassName={`h-full rounded-full ${
                      feature.status === 'completed' ? 'bg-green-500' :
                      feature.status === 'in-progress' ? 'bg-blue-500' :
                      feature.status === 'critical' ? 'bg-red-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      
      {/* Critical Issues */}
      <h2 className="text-xl font-semibold mb-4" id="critical-issues">Critical Issues</h2>
      <Card className="p-4 bg-red-50 mb-8 border-l-4 border-red-600" aria-labelledby="critical-issues">
        <div className="space-y-4">
          {criticalIssues.map((issue, index) => (
            <div key={index} className="border-b border-red-100 pb-3 last:border-0 last:pb-0">
              <div className="flex items-start">
                <div className="text-red-500 mr-2 mt-1 flex-shrink-0" aria-hidden="true">⚠</div>
                <div>
                  <h3 className="font-medium text-red-700">{issue.title}</h3>
                  <p className="text-sm text-gray-700">{issue.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Next Steps */}
      <h2 className="text-xl font-semibold mb-4" id="recommendations">Recommendations</h2>
      <Card className="p-4 bg-blue-50 border-l-4 border-blue-600" aria-labelledby="recommendations">
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li className="font-bold text-red-800">
            <span className="mr-2">1.</span>
            <span>Focus on resolving critical subscription system issues</span>
          </li>
          <li className="text-blue-800">
            <span className="mr-2">2.</span>
            <span>Prioritize fixing authentication security concerns</span>
          </li>
          <li className="text-blue-800">
            <span className="mr-2">3.</span>
            <span>Address database migration failures</span>
          </li>
          <li className="text-blue-800">
            <span className="mr-2">4.</span>
            <span>Complete in-progress core features</span>
          </li>
          <li className="text-blue-800">
            <span className="mr-2">5.</span>
            <span>Begin planning for next feature implementation phase</span>
          </li>
        </ol>
      </Card>
    </div>
  );
}
```

## Layouts

### AdminLayout.tsx
This component provides the sidebar navigation for the admin section.

```tsx
// src/layouts/AdminLayout.tsx
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  CreditCard,
  FileEdit,
  Wallet,
  List,
  Bug,
  MessageSquare
} from 'lucide-react';
import { DashboardLayout } from './DashboardLayout';

export function AdminLayout() {
  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      end: true
    },
    // Add other menu items as needed
    {
      path: "/admin/roadmap",
      label: "Roadmap Items",
      icon: <List className="w-5 h-5" />
    },
    {
      path: "/admin/debug",
      label: "Debug List",
      icon: <Bug className="w-5 h-5" />
    },
    {
      path: "/admin/completion",
      label: "Project Completion",
      icon: <FileText className="w-5 h-5" />
    }
  ];

  return (
    <DashboardLayout
      menuItems={menuItems}
      title="Admin"
      showBackToHome={true}
      notifications={0}
      userName="Admin User"
    />
  );
}
```

### DashboardLayout.tsx
A shared layout component that provides the dashboard structure, sidebar, and header.

```tsx
// src/layouts/DashboardLayout.tsx
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import {
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Search
} from 'lucide-react';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

interface DashboardLayoutProps {
  menuItems: MenuItem[];
  title: string;
  showBackToHome?: boolean;
  notifications?: number;
  userAvatar?: string;
  userName?: string;
}

export function DashboardLayout({
  menuItems,
  title,
  showBackToHome = false,
  notifications = 0,
  userAvatar = '',
  userName = 'User'
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Implement logout logic
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 z-50 bg-white dark:bg-gray-800 p-2 m-2 text-primary-600 dark:text-primary-400">
        Skip to main content
      </a>

      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Left section: Logo and hamburger */}
          <div className="flex items-center">
            <button 
              onClick={toggleMobileMenu}
              className="mr-2 text-gray-500 dark:text-gray-400 md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <button 
              onClick={toggleSidebar}
              className="mr-4 text-gray-500 dark:text-gray-400 hidden md:block"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center">
              <Link 
                to="/"
                className="text-xl font-bold text-primary-600 dark:text-primary-400"
              >
                Your App
              </Link>
              <span className="text-xl font-medium text-gray-600 dark:text-gray-400 ml-1">
                {title}
              </span>
            </div>
          </div>

          {/* Right section: User menu, etc. */}
          <div className="flex items-center">
            {/* Notification bell */}
            <div className="relative mr-3">
              <button
                className="p-1 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                aria-label="View notifications"
              >
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {notifications > 9 ? '9+' : notifications}
                  </span>
                )}
              </button>
            </div>

            {/* User dropdown */}
            <div className="relative ml-3">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-800 flex items-center justify-center text-sm font-medium text-primary-800 dark:text-primary-200">
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={`${userName}'s avatar`}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {userName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${sidebarOpen ? 'md:w-64' : 'md:w-20'} md:flex md:flex-col`}>
        <div className="h-16" />
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <nav className="mt-5 px-2 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) => 
                  `group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-800/30 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <div className="mr-4 flex-shrink-0">
                  {item.icon}
                </div>
                <span className={`${sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'} transition-opacity duration-200`}>
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
        
        {/* Sidebar footer with logout button */}
        <div className="px-2 pb-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
          >
            <LogOut className="mr-4 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className={`${sidebarOpen ? 'opacity-100' : 'opacity-0 md:opacity-0'} transition-opacity duration-200`}>
              Logout
            </span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`md:pl-${sidebarOpen ? '64' : '20'} pt-16 transition-all duration-300`}>
        <main id="main-content" className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

## Routes Setup

Add the following routes to your app's routing configuration (typically in App.tsx or a separate routes file):

```tsx
// In your App.tsx or routes configuration file
import { AdminLayout } from './layouts/AdminLayout';
import { AdminRoadmap } from './pages/admin/AdminRoadmap';
import { AdminDebug } from './pages/admin/AdminDebug';
import CompletionDashboard from './pages/admin/CompletionDashboard';

// Add this to your routes configuration
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminDashboard />} />
  <Route path="roadmap" element={<AdminRoadmap />} />
  <Route path="debug" element={<AdminDebug />} />
  <Route path="completion" element={<CompletionDashboard />} />
  {/* Other admin routes as needed */}
</Route>
```

## Step-by-Step Implementation Guide

Follow these steps to implement the admin project management system in your application:

1. **Set up the required dependencies**
   ```bash
   npm install react-router-dom lucide-react
   ```
   
   If you're using Tailwind CSS:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Create the directory structure**
   Make the necessary folders for components, layouts, and pages.

3. **Implement the UI components**
   Create the Card, HeadingSection, and Progress components in the ui folder.

4. **Create the data models**
   Implement the roadmapData.ts and debugData.ts files with your project's specific features and debug items.

5. **Set up the layouts**
   Create the DashboardLayout and AdminLayout components.

6. **Implement the admin pages**
   Create the AdminRoadmap, AdminDebug, and CompletionDashboard components.

7. **Configure the routes**
   Add the admin routes to your application's routing configuration.

8. **Customize the data**
   Update the data in roadmapData.ts, debugData.ts, and CompletionDashboard.tsx to reflect your project's specific features, issues, and progress.

9. **Test and refine**
   Navigate to your admin routes (/admin/roadmap, /admin/debug, /admin/completion) to test the implementation and make any necessary adjustments.

## Customization Options

Here are some ways to customize the admin project management system:

1. **Theme Colors**: Update the color classes in the components to match your application's branding.

2. **Data Structure**: Extend the data models with additional fields relevant to your project.

3. **Additional Pages**: Add more specialized dashboards or management pages to the admin system.

4. **Charts and Visualizations**: Integrate chart libraries like Chart.js or Recharts for more sophisticated data visualizations.

5. **Data Persistence**: Connect the components to a backend API or database to store and retrieve real project data.

6. **User Roles**: Implement role-based access control to restrict certain parts of the admin system.

7. **Export Functionality**: Add options to export roadmap, debug, or completion data as CSV or PDF files.

8. **Internationalization**: Add support for multiple languages using libraries like react-intl or i18next.

## Conclusion

This guide provides all the necessary details to implement a comprehensive admin project management system in your React application. By following these instructions, you can create a powerful set of dashboards for tracking project progress, managing issues, and visualizing completion status.

The system is designed to be modular and customizable, allowing you to adapt it to your specific project requirements while maintaining a consistent and professional user experience.