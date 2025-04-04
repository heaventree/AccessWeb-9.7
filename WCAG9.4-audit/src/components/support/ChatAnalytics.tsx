import { useState } from 'react';
import { Card } from '../ui/Card';
import { ChatStats } from '../../types/chat';

export function ChatAnalytics() {
  // This would typically come from an API
  const [stats] = useState<ChatStats>({
    totalSessions: 142,
    activeSessionsCount: 3,
    averageSessionDuration: 4.2, // minutes
    messagesPerSession: 6.8,
    topQueries: [
      { query: "WCAG compliance", count: 28 },
      { query: "color contrast", count: 22 },
      { query: "keyboard navigation", count: 18 },
      { query: "screen reader compatibility", count: 15 },
      { query: "form validation", count: 12 }
    ],
    resolvedWithoutHuman: 106,
    sentimentAnalysis: {
      positive: 68,
      neutral: 55,
      negative: 19
    },
    timeOfDay: {
      morning: 42,
      afternoon: 65,
      evening: 30,
      night: 5
    }
  });

  // Date ranges for filtering
  const dateRanges = [
    { label: 'Last 7 days', value: '7d' },
    { label: 'Last 30 days', value: '30d' },
    { label: 'Last 90 days', value: '90d' },
    { label: 'Year to date', value: 'ytd' },
    { label: 'All time', value: 'all' }
  ];

  // Sample data for conversation flow visualization
  const flowData = [
    { from: 'Initial Question', to: 'Bot Response', value: 142 },
    { from: 'Bot Response', to: 'Follow-up Question', value: 98 },
    { from: 'Bot Response', to: 'Conversation End', value: 44 },
    { from: 'Follow-up Question', to: 'Bot Response 2', value: 98 },
    { from: 'Bot Response 2', to: 'Further Question', value: 67 },
    { from: 'Bot Response 2', to: 'Conversation End', value: 31 },
    { from: 'Further Question', to: 'Bot Response 3', value: 67 },
    { from: 'Bot Response 3', to: 'Human Transfer', value: 15 },
    { from: 'Bot Response 3', to: 'Conversation End', value: 52 }
  ];

  return (
    <div className="space-y-8">
      {/* Date range filter */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          {dateRanges.map((range, i) => (
            <button
              key={range.value}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                i === 0 ? 'rounded-l-md' : ''
              } ${
                i === dateRanges.length - 1 ? 'rounded-r-md' : ''
              } ${
                i === 0 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Conversations</h3>
          <p className="text-3xl font-bold mt-1">{stats.totalSessions}</p>
          <div className="mt-1 flex items-center text-sm text-green-600">
            <span className="font-medium">+12.5%</span>
            <span className="ml-1">from previous period</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Avg. Messages</h3>
          <p className="text-3xl font-bold mt-1">{stats.messagesPerSession}</p>
          <div className="mt-1 flex items-center text-sm text-green-600">
            <span className="font-medium">+3.2%</span>
            <span className="ml-1">from previous period</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Resolved by Bot</h3>
          <p className="text-3xl font-bold mt-1">{Math.round((stats.resolvedWithoutHuman / stats.totalSessions) * 100)}%</p>
          <div className="mt-1 flex items-center text-sm text-green-600">
            <span className="font-medium">+5.3%</span>
            <span className="ml-1">from previous period</span>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">User Satisfaction</h3>
          <p className="text-3xl font-bold mt-1">{Math.round((stats.sentimentAnalysis.positive / stats.totalSessions) * 100)}%</p>
          <div className="mt-1 flex items-center text-sm text-yellow-600">
            <span className="font-medium">-2.1%</span>
            <span className="ml-1">from previous period</span>
          </div>
        </Card>
      </div>

      {/* Top queries */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top User Queries</h3>
        <div className="space-y-4">
          {stats.topQueries.map((query, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-800">{i + 1}.</span>
                <span className="ml-2 text-sm text-gray-800">{query.query}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">{query.count}</span>
                <div className="w-40 bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${(query.count / stats.topQueries[0].count) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-blue-600 font-medium">
          <button className="hover:underline">View all queries</button>
        </div>
      </Card>

      {/* Conversation Flow Visualization */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Conversation Flow</h3>
        <div className="h-60 overflow-auto">
          <div className="flex flex-nowrap">
            {flowData.map((flow, i) => (
              <div key={i} className="flex items-center flex-shrink-0">
                <div className="p-3 bg-blue-100 rounded-lg border border-blue-200 text-center min-w-[120px]">
                  <span className="text-sm font-medium text-blue-800">{flow.from}</span>
                </div>
                <div className="flex flex-col items-center px-2">
                  <div className="w-12 h-0.5 bg-blue-300"></div>
                  <span className="text-xs text-gray-500 mt-1">{flow.value}</span>
                </div>
                {i === flowData.length - 1 && (
                  <div className="p-3 bg-blue-100 rounded-lg border border-blue-200 text-center min-w-[120px]">
                    <span className="text-sm font-medium text-blue-800">{flow.to}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Sentiment Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">User Sentiment</h3>
        <div className="flex justify-around items-center mt-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-2">
              <span className="text-xl font-semibold">{Math.round((stats.sentimentAnalysis.positive / stats.totalSessions) * 100)}%</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">Positive</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 mb-2">
              <span className="text-xl font-semibold">{Math.round((stats.sentimentAnalysis.neutral / stats.totalSessions) * 100)}%</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">Neutral</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-2">
              <span className="text-xl font-semibold">{Math.round((stats.sentimentAnalysis.negative / stats.totalSessions) * 100)}%</span>
            </div>
            <p className="text-sm text-gray-500 font-medium">Negative</p>
          </div>
        </div>
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Sentiment Trend</h4>
          <div className="w-full h-32 bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="w-full h-full flex items-end">
              {Array.from({ length: 30 }).map((_, i) => (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col items-center"
                >
                  <div 
                    className={`w-2 ${i % 3 === 0 ? 'bg-green-500' : i % 3 === 1 ? 'bg-gray-400' : 'bg-red-500'}`} 
                    style={{ 
                      height: `${Math.random() * 70 + 10}%`, 
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Time of Day Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Usage by Time of Day</h3>
        <div className="h-60 mt-4">
          <div className="flex h-full items-end">
            {Object.entries(stats.timeOfDay).map(([time, count], i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div 
                  className="w-16 bg-blue-600 rounded-t-md" 
                  style={{ 
                    height: `${(count / Math.max(...Object.values(stats.timeOfDay))) * 100}%`,
                    opacity: 0.6 + (i * 0.1)
                  }}
                ></div>
                <span className="mt-2 text-xs text-gray-500 capitalize">{time}</span>
                <span className="text-xs font-medium text-gray-700">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}