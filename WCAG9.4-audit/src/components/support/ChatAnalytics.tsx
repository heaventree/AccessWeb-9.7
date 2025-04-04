import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCw, Search, X } from 'lucide-react';

interface ChatQueryLog {
  id: string;
  query: string;
  response: string;
  timestamp: string;
  sessionId: string;
  category?: string;
}

interface KeywordData {
  keyword: string;
  count: number;
}

interface CategoryData {
  name: string;
  value: number;
}

export function ChatAnalytics() {
  const [queryLogs, setQueryLogs] = useState<ChatQueryLog[]>([]);
  const [keywordData, setKeywordData] = useState<KeywordData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    
    // In a real implementation, this would fetch data from an API
    // For now, we'll load from localStorage
    try {
      const storedLogs = localStorage.getItem('chatQueryLogs');
      if (storedLogs) {
        const logs = JSON.parse(storedLogs) as ChatQueryLog[];
        setQueryLogs(logs);
        analyzeKeywords(logs);
        analyzeCategories(logs);
      }
    } catch (error) {
      console.error('Error loading chat logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeKeywords = (logs: ChatQueryLog[]) => {
    // Simple keyword extraction
    const keywordCounts: Record<string, number> = {};
    const stopWords = new Set(['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
                              'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 
                              'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 
                              'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 
                              'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 
                              'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 
                              'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 
                              'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
                              'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 
                              'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 
                              'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 
                              'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'help']);
    
    logs.forEach(log => {
      const words = log.query.toLowerCase().split(/\W+/).filter(word => 
        word.length > 2 && !stopWords.has(word)
      );
      
      words.forEach(word => {
        keywordCounts[word] = (keywordCounts[word] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count
    const keywordArray = Object.entries(keywordCounts)
      .map(([keyword, count]) => ({ keyword, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 keywords
    
    setKeywordData(keywordArray);
  };

  const analyzeCategories = (logs: ChatQueryLog[]) => {
    // Simplified category detection
    const categories: Record<string, number> = {
      'WCAG Standards': 0,
      'Contrast Issues': 0,
      'Screen Readers': 0,
      'Navigation': 0,
      'Forms': 0,
      'Other': 0
    };
    
    logs.forEach(log => {
      const query = log.query.toLowerCase();
      
      if (query.includes('wcag') || query.includes('standard') || query.includes('guideline') || query.includes('compliance')) {
        categories['WCAG Standards']++;
      } else if (query.includes('contrast') || query.includes('color') || query.includes('colour')) {
        categories['Contrast Issues']++;
      } else if (query.includes('screen reader') || query.includes('alt') || query.includes('aria')) {
        categories['Screen Readers']++;
      } else if (query.includes('navigation') || query.includes('menu') || query.includes('link')) {
        categories['Navigation']++;
      } else if (query.includes('form') || query.includes('input') || query.includes('field')) {
        categories['Forms']++;
      } else {
        categories['Other']++;
      }
    });
    
    // Convert to array format for charts
    const categoryArray = Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0); // Only include categories with data
    
    setCategoryData(categoryArray);
  };

  const exportData = () => {
    // Create CSV data
    const headers = ['Timestamp', 'Query', 'Response', 'Session ID'];
    const csvRows = [
      headers.join(','),
      ...queryLogs.map(log => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        // Escape commas and quotes in text fields
        const escapedQuery = `"${log.query.replace(/"/g, '""')}"`;
        const escapedResponse = `"${log.response.replace(/"/g, '""')}"`;
        return [timestamp, escapedQuery, escapedResponse, log.sessionId].join(',');
      })
    ];
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger click
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chat_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = searchTerm 
    ? queryLogs.filter(log => 
        log.query.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.response.toLowerCase().includes(searchTerm.toLowerCase()))
    : queryLogs;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Chat Support Analytics</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportData}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={queryLogs.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search queries..."
            className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Keywords</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={keywordData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="keyword" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Mentions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Query Categories</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [value, props.payload.name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Queries</h3>
        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No chat queries found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Query
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.slice(0, 10).map((log) => (
                  <tr key={log.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.query}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.response}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLogs.length > 10 && (
              <div className="py-3 text-center text-sm text-gray-500">
                Showing 10 of {filteredLogs.length} queries
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}