// Chat Message Types
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// Chat Session Types
export interface ChatSession {
  id: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  messages: Message[];
  userRating?: number;
  feedback?: string;
}

// Analytics Types
export interface ChatStatistics {
  totalSessions: number;
  totalMessages: number;
  averageSessionLength: number;
  averageResponseTime: number;
  userSatisfactionScore: number;
  commonTopics: {
    topic: string;
    count: number;
  }[];
  dailyActivity: {
    date: string;
    sessions: number;
  }[];
}

// Settings Types
export interface ChatSettings {
  greeting: string;
  enableAutoSuggestions: boolean;
  enableContentScanning: boolean;
  scanningFrequency: 'hourly' | 'daily' | 'weekly';
  aiModel: string;
  maxHistoryLength: number;
  autoLearningEnabled: boolean;
}

// Training Data Types
export interface TrainingTopic {
  id: string;
  name: string;
  examples: string[];
  responses: string[];
  priority: number;
}

// Content Audit Types
export interface ContentAuditResult {
  lastScan: string;
  scannedPages: number;
  extractedTopics: string[];
  newTopics: string[];
  contentGaps: {
    topic: string;
    confidence: number;
    suggestion: string;
  }[];
}