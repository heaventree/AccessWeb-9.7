import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';
import { ChatSettings, ChatStats } from '../../types/chat';
import { MessageSquare, Settings, BarChart2, BookOpen, PlusCircle } from 'lucide-react';

export function ChatbotManagement() {
  // Sample initial settings - in a real app, these would come from an API
  const [settings, setSettings] = useState<ChatSettings>({
    enabled: true,
    initialMessage: "Hello! I'm your accessibility assistant. How can I help you today?",
    botName: "WCAG Assistant",
    maxAttachmentSize: 5, // MB
    supportedFileTypes: [".jpg", ".png", ".pdf", ".txt"],
    offHoursMessage: "Our support team is currently unavailable. Please check back during business hours.",
    workingHours: {
      start: "09:00",
      end: "17:00",
      timezone: "UTC",
      workDays: [1, 2, 3, 4, 5] // Monday to Friday
    },
    thresholdForHumanTransfer: 3,
    enableVoiceInput: true,
    enableAttachments: true,
    enableFeedbackCollection: true,
    enableAnalytics: true,
    autoScan: {
      enabled: true,
      interval: 24, // daily
      lastScan: new Date().toISOString()
    }
  });

  // Sample chatbot stats - in a real app, these would come from an API
  const [stats, setStats] = useState<ChatStats>({
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

  // Sample training topics - in a real app, these would come from an API
  const [trainingTopics, setTrainingTopics] = useState([
    { topic: "WCAG 2.1 Guidelines", trained: true, accuracy: 92 },
    { topic: "Assistive Technologies", trained: true, accuracy: 88 },
    { topic: "Common Accessibility Issues", trained: true, accuracy: 94 },
    { topic: "Testing Methodologies", trained: true, accuracy: 85 },
    { topic: "Mobile Accessibility", trained: true, accuracy: 81 },
    { topic: "PDF Accessibility", trained: false, accuracy: 0 },
    { topic: "Multimedia Accessibility", trained: false, accuracy: 0 }
  ]);

  // Handler for toggling chatbot enabled state
  const toggleChatbot = () => {
    setSettings(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  // Handler for updating chatbot settings
  const updateSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // This would typically save the settings to an API
    console.log("Saving settings:", settings);
    alert("Settings updated successfully!");
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <PageHeader
        title="Chatbot Management"
        description="Configure and monitor your site's support chatbot"
        icon={<MessageSquare className="w-8 h-8 text-blue-600" />}
      />
      
      <Tabs defaultValue="settings" className="mt-8">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="training">
            <BookOpen className="w-4 h-4 mr-2" />
            Knowledge Base
          </TabsTrigger>
        </TabsList>
        
        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Chatbot Configuration</h2>
              <div className="flex items-center">
                <span className="mr-3 text-sm font-medium">
                  {settings.enabled ? "Enabled" : "Disabled"}
                </span>
                <button
                  type="button"
                  onClick={toggleChatbot}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    settings.enabled ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
            
            <form onSubmit={updateSettings}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bot Name
                  </label>
                  <input
                    type="text"
                    value={settings.botName}
                    onChange={(e) => setSettings({...settings, botName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Initial Greeting Message
                  </label>
                  <input
                    type="text"
                    value={settings.initialMessage}
                    onChange={(e) => setSettings({...settings, initialMessage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Off-Hours Message
                  </label>
                  <input
                    type="text"
                    value={settings.offHoursMessage}
                    onChange={(e) => setSettings({...settings, offHoursMessage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Human Transfer Attempts
                  </label>
                  <input
                    type="number"
                    value={settings.thresholdForHumanTransfer}
                    onChange={(e) => setSettings({...settings, thresholdForHumanTransfer: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="voice-input"
                    checked={settings.enableVoiceInput}
                    onChange={(e) => setSettings({...settings, enableVoiceInput: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="voice-input" className="ml-2 text-sm text-gray-700">
                    Enable Voice Input
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="attachments"
                    checked={settings.enableAttachments}
                    onChange={(e) => setSettings({...settings, enableAttachments: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="attachments" className="ml-2 text-sm text-gray-700">
                    Enable Attachments
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="feedback"
                    checked={settings.enableFeedbackCollection}
                    onChange={(e) => setSettings({...settings, enableFeedbackCollection: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="feedback" className="ml-2 text-sm text-gray-700">
                    Collect User Feedback
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="analytics"
                    checked={settings.enableAnalytics}
                    onChange={(e) => setSettings({...settings, enableAnalytics: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="analytics" className="ml-2 text-sm text-gray-700">
                    Enable Analytics
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto-scan"
                    checked={settings.autoScan.enabled}
                    onChange={(e) => setSettings({
                      ...settings, 
                      autoScan: {
                        ...settings.autoScan,
                        enabled: e.target.checked
                      }
                    })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="auto-scan" className="ml-2 text-sm text-gray-700">
                    Automatic Content Scanning
                  </label>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Total Sessions</h3>
              <p className="text-3xl font-bold mt-1">{stats.totalSessions}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Active Now</h3>
              <p className="text-3xl font-bold mt-1">{stats.activeSessionsCount}</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Avg. Duration</h3>
              <p className="text-3xl font-bold mt-1">{stats.averageSessionDuration} min</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Self-Resolved</h3>
              <p className="text-3xl font-bold mt-1">{Math.round((stats.resolvedWithoutHuman / stats.totalSessions) * 100)}%</p>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top User Queries</h3>
              <div className="space-y-3">
                {stats.topQueries.map((query, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-sm">{query.query}</span>
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
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">User Sentiment</h3>
              <div className="flex justify-between items-center mt-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-500 mb-2">
                    <span className="text-lg font-semibold">{Math.round((stats.sentimentAnalysis.positive / stats.totalSessions) * 100)}%</span>
                  </div>
                  <p className="text-sm text-gray-500">Positive</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-500 mb-2">
                    <span className="text-lg font-semibold">{Math.round((stats.sentimentAnalysis.neutral / stats.totalSessions) * 100)}%</span>
                  </div>
                  <p className="text-sm text-gray-500">Neutral</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-2">
                    <span className="text-lg font-semibold">{Math.round((stats.sentimentAnalysis.negative / stats.totalSessions) * 100)}%</span>
                  </div>
                  <p className="text-sm text-gray-500">Negative</p>
                </div>
              </div>
            </Card>
          </div>
          
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
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Knowledge Base Tab */}
        <TabsContent value="training">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Knowledge Base Topics</h2>
              <button 
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add New Topic
              </button>
            </div>
            
            <div className="mt-4">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-gray-500 border-b border-gray-200 pb-2">
                <div className="col-span-3">Topic</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1">Accuracy</div>
                <div className="col-span-1">Actions</div>
              </div>
              
              <div className="space-y-3 mt-2">
                {trainingTopics.map((topic, i) => (
                  <div key={i} className="grid grid-cols-6 gap-4 items-center py-3 border-b border-gray-100">
                    <div className="col-span-3 font-medium">{topic.topic}</div>
                    <div className="col-span-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        topic.trained ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {topic.trained ? 'Trained' : 'Pending'}
                      </span>
                    </div>
                    <div className="col-span-1">
                      {topic.trained ? (
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">{topic.accuracy}%</span>
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                topic.accuracy > 90 ? 'bg-green-500' : 
                                topic.accuracy > 80 ? 'bg-yellow-500' : 'bg-red-500'
                              }`} 
                              style={{ width: `${topic.accuracy}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </div>
                    <div className="col-span-1">
                      <button 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {topic.trained ? 'Retrain' : 'Train Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8 bg-blue-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-blue-800 mb-2">Content Auto-Scan</h3>
              <p className="text-sm text-blue-700 mb-2">
                Last scan: {new Date(settings.autoScan.lastScan || '').toLocaleString()}
              </p>
              <div className="flex space-x-2">
                <button 
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                >
                  Scan Content Now
                </button>
                <button 
                  className="px-3 py-1.5 border border-blue-600 text-blue-600 text-sm font-medium rounded hover:bg-blue-50"
                >
                  View Scan History
                </button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}