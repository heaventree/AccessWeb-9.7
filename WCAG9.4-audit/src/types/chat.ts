/**
 * Chat Message Types
 * Defines the structure of chat messages in the support system
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    sentimentScore?: number;
    category?: string;
    wasHelpful?: boolean;
    relatedArticles?: string[];
    [key: string]: any;
  };
}

export interface ChatSession {
  id: string;
  userId?: string;
  userIp: string;
  userAgent: string;
  startTime: string;
  endTime?: string;
  messages: ChatMessage[];
  resolved: boolean;
  transferredToHuman: boolean;
  feedback?: {
    rating?: number;
    comments?: string;
  };
}

export interface ChatStats {
  totalSessions: number;
  activeSessionsCount: number;
  averageSessionDuration: number;
  messagesPerSession: number;
  topQueries: {
    query: string;
    count: number;
  }[];
  resolvedWithoutHuman: number;
  sentimentAnalysis: {
    positive: number;
    neutral: number;
    negative: number;
  };
  timeOfDay: {
    morning: number;
    afternoon: number;
    evening: number;
    night: number;
  };
}

export interface ChatSettings {
  enabled: boolean;
  initialMessage: string;
  botName: string;
  maxAttachmentSize: number;
  supportedFileTypes: string[];
  offHoursMessage: string;
  workingHours: {
    start: string;
    end: string;
    timezone: string;
    workDays: number[];
  };
  thresholdForHumanTransfer: number;
  enableVoiceInput: boolean;
  enableAttachments: boolean;
  enableFeedbackCollection: boolean;
  enableAnalytics: boolean;
  autoScan: {
    enabled: boolean;
    interval: number; // hours
    lastScan?: string;
  };
}