import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { ChatAnalytics } from '../../components/support/ChatAnalytics';
import { getContentAudits, performContentAudit } from '../../services/chatbotContentAudit';
import { ChatAudit } from '../../types/chat';
import { CirclePlus, RefreshCw, AlertTriangle, CheckCircle, Calendar, Clock } from 'lucide-react';

export function ChatbotManagement() {
  const [chatbotConfig, setChatbotConfig] = useState({
    greeting: 'Hi there! How can I help you with web accessibility today?',
    name: 'AccessWeb Support',
    fallbackMessage: "I'm not sure I understand. Could you please rephrase your question?",
    enabled: true
  });
  const [contentAudits, setContentAudits] = useState<ChatAudit[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditMessage, setAuditMessage] = useState('');

  useEffect(() => {
    // Load config from localStorage
    const storedConfig = localStorage.getItem('chatbotConfig');
    if (storedConfig) {
      try {
        setChatbotConfig(JSON.parse(storedConfig));
      } catch (error) {
        console.error('Error parsing stored chatbot config:', error);
      }
    }

    // Load content audits
    setContentAudits(getContentAudits());
  }, []);

  const saveConfig = () => {
    localStorage.setItem('chatbotConfig', JSON.stringify(chatbotConfig));
    // In a real implementation, this would save to the server
    alert('Configuration saved successfully');
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setChatbotConfig(prev => ({ ...prev, [name]: checked }));
    } else {
      setChatbotConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  const runContentAudit = async () => {
    setIsAuditing(true);
    setAuditMessage('');
    
    try {
      const audit = await performContentAudit();
      setContentAudits(getContentAudits());
      
      if (audit.contentUpdated) {
        setAuditMessage('Audit completed: Content changes found and indexed');
      } else {
        setAuditMessage('Audit completed: No content changes detected');
      }
    } catch (error) {
      console.error('Error running content audit:', error);
      setAuditMessage('Error performing content audit');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Chatbot Management</h1>
      
      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList className="bg-gray-100 rounded-lg p-1">
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content-audits">Content Audits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="configuration" className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Chatbot Configuration</h2>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Chatbot Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={chatbotConfig.name}
                onChange={handleConfigChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="greeting" className="block text-sm font-medium text-gray-700 mb-1">
                Greeting Message
              </label>
              <textarea
                id="greeting"
                name="greeting"
                value={chatbotConfig.greeting}
                onChange={handleConfigChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="fallbackMessage" className="block text-sm font-medium text-gray-700 mb-1">
                Fallback Message
              </label>
              <textarea
                id="fallbackMessage"
                name="fallbackMessage"
                value={chatbotConfig.fallbackMessage}
                onChange={handleConfigChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Displayed when the chatbot doesn't understand the user's query.
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enabled"
                name="enabled"
                checked={chatbotConfig.enabled}
                onChange={handleConfigChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
                Enable Chatbot
              </label>
            </div>
            
            <div className="pt-4">
              <button
                onClick={saveConfig}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <ChatAnalytics />
        </TabsContent>
        
        <TabsContent value="content-audits" className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Content Audits</h2>
            <button
              onClick={runContentAudit}
              disabled={isAuditing}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isAuditing ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <CirclePlus className="w-5 h-5 mr-2" />
              )}
              Run Content Audit
            </button>
          </div>
          
          {auditMessage && (
            <div className={`p-4 mb-6 rounded-md ${auditMessage.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              {auditMessage.includes('Error') ? (
                <AlertTriangle className="inline-block w-5 h-5 mr-2" />
              ) : (
                <CheckCircle className="inline-block w-5 h-5 mr-2" />
              )}
              {auditMessage}
            </div>
          )}
          
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                    Date
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Changes
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    New Content
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Modified Content
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {contentAudits.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No content audits have been performed yet
                    </td>
                  </tr>
                ) : (
                  contentAudits.map((audit) => (
                    <tr key={audit.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(audit.timestamp).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-gray-500 text-xs mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(audit.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {audit.contentUpdated ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" /> 
                            Changes detected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            No changes
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {audit.newTopics.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {audit.newTopics.slice(0, 3).map((topic, i) => (
                              <li key={i} className="truncate max-w-xs">
                                {topic}
                              </li>
                            ))}
                            {audit.newTopics.length > 3 && (
                              <li className="text-gray-400">
                                +{audit.newTopics.length - 3} more
                              </li>
                            )}
                          </ul>
                        ) : (
                          <span>None</span>
                        )}
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        {audit.modifiedTopics.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {audit.modifiedTopics.slice(0, 3).map((topic, i) => (
                              <li key={i} className="truncate max-w-xs">
                                {topic}
                              </li>
                            ))}
                            {audit.modifiedTopics.length > 3 && (
                              <li className="text-gray-400">
                                +{audit.modifiedTopics.length - 3} more
                              </li>
                            )}
                          </ul>
                        ) : (
                          <span>None</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}