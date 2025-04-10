// Type definitions for the feedback system

// Position type
export interface Position {
  x: number;
  y: number;
}

// Feedback status types
export type FeedbackStatus = 'pending' | 'inProgress' | 'resolved';
export type FeedbackCategory = 'debug' | 'roadmap';

// Feedback item interface
export interface FeedbackItem {
  id: string;
  position: Position;
  elementPath: string;
  comment: string;
  status: FeedbackStatus;
  createdAt: string;
  category: FeedbackCategory;
  page: string; // Store the page path where feedback was created
}

// Debug item types
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

export type DebugItemSource = 'feedback' | 'manual' | 'system';

// Debug item interface
export interface DebugItem {
  id: string;
  title: string;
  description: string;
  category: DebugItemCategory;
  status: DebugItemStatus;
  priority: DebugItemPriority;
  dateIdentified: string;
  source?: DebugItemSource;
  assignedTo?: string;
  relatedIssues?: string[];
  todoItems?: string[];
  notes?: string;
}

// Roadmap feature types
export type FeatureStatus = 'planned' | 'in-progress' | 'completed' | 'deferred';
export type RoadmapFeatureSource = 'feedback' | 'manual' | 'system';
export type FeatureCategory = 'core' | 'ui' | 'reporting' | 'integration' | 'analytics';

// Roadmap feature interface
export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  priority: number; // 1 (highest) to 5 (lowest)
  category: FeatureCategory;
  source?: RoadmapFeatureSource;
  dependencies?: string[]; // IDs of features this depends on
  estimatedCompletionDate?: string;
  completedDate?: string;
}