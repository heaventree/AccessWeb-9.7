// Feedback type definitions
export enum FeedbackCategory {
  ACCESSIBILITY = 'accessibility',
  USABILITY = 'usability',
  PERFORMANCE = 'performance',
  VISUAL = 'visual',
  FUNCTIONALITY = 'functionality',
  CONTENT = 'content',
  OTHER = 'other'
}

export enum FeedbackStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export interface Position {
  x: number;
  y: number;
}

export interface FeedbackItem {
  id: string;
  elementPath: string;
  position: Position;
  comment: string;
  category: FeedbackCategory;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt?: string;
  page: string;
}

export interface CreateFeedbackPayload {
  elementPath: string;
  position: Position;
  comment: string;
  category: FeedbackCategory;
  page: string;
}

// Debug dashboard types
export enum DebugItemStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  WONT_FIX = 'wont-fix',
  NEEDS_INFO = 'needs-info',
}

export enum DebugItemPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum DebugItemCategory {
  ACCESSIBILITY = 'accessibility',
  FUNCTIONALITY = 'functionality',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  VISUAL = 'visual',
  CONTENT = 'content',
  OTHER = 'other',
}

export enum DebugItemSource {
  FEEDBACK = 'feedback',
  MANUAL = 'manual',
  AUTOMATED = 'automated',
}

export interface DebugItem {
  id: string;
  title: string;
  description: string;
  status: DebugItemStatus;
  priority: DebugItemPriority;
  category: DebugItemCategory;
  createdAt: string;
  updatedAt?: string;
  assignedTo?: string;
  source: DebugItemSource;
  feedbackId?: string;
  steps?: string[];
}

// Roadmap types
export enum FeatureStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum RoadmapFeatureSource {
  FEEDBACK = 'feedback',
  MANUAL = 'manual',
}

export interface RoadmapFeature {
  id: string;
  title: string;
  description: string;
  status: FeatureStatus;
  category: string;
  priority: number;
  createdAt: string;
  updatedAt?: string;
  estimatedCompletion?: string;
  dependencies?: string[];
  source: RoadmapFeatureSource;
  feedbackIds?: string[];
}