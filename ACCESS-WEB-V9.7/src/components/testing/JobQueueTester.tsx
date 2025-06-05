import React, { useState, useEffect } from 'react';
import apiRequest from '@/lib/apiClient';

interface TestResult {
  timestamp: string;
  success: boolean;
  message: string;
  connectionId: number;
  duration: number;
}

interface JobQueueTesterProps {
  connectionId?: number;
}

export const JobQueueTester: React.FC<JobQueueTesterProps> = ({ connectionId = 8 }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [testCount, setTestCount] = useState(0);
  const [maxTests, setMaxTests] = useState(10);

  const triggerScan = async (): Promise<TestResult> => {
    const startTime = Date.now();
    try {
      const response = await apiRequest(`/api/scanner/trigger/${connectionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const duration = Date.now() - startTime;
      
      return {
        timestamp: new Date().toISOString(),
        success: true,
        message: response.message || 'Scan triggered successfully',
        connectionId,
        duration
      };
    } catch (error: any) {
      const duration = Date.now() - startTime;
      return {
        timestamp: new Date().toISOString(),
        success: false,
        message: error.message || 'Failed to trigger scan',
        connectionId,
        duration
      };
    }
  };

  const startTesting = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTestResults([]);
    setTestCount(0);

    // Run initial test
    const initialResult = await triggerScan();
    setTestResults([initialResult]);
    setTestCount(1);

    // Start interval testing every 5 seconds
    const id = setInterval(async () => {
      setTestCount(prev => {
        if (prev >= maxTests) {
          stopTesting();
          return prev;
        }
        
        triggerScan().then(result => {
          setTestResults(prev => [...prev, result].slice(-20)); // Keep last 20 results
        });
        
        return prev + 1;
      });
    }, 5000);

    setIntervalId(id);
  };

  const stopTesting = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const successCount = testResults.filter(r => r.success).length;
  const avgDuration = testResults.length > 0 
    ? Math.round(testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length)
    : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Job Queue Testing Tool
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Connection ID: {connectionId}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isRunning 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isRunning ? 'Running' : 'Stopped'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-600">Tests Run</div>
          <div className="text-2xl font-bold text-blue-900">{testCount}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">Success Rate</div>
          <div className="text-2xl font-bold text-green-900">
            {testResults.length > 0 ? Math.round((successCount / testResults.length) * 100) : 0}%
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-yellow-600">Avg Duration</div>
          <div className="text-2xl font-bold text-yellow-900">{avgDuration}ms</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-600">Max Tests</div>
          <div className="text-2xl font-bold text-purple-900">{maxTests}</div>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <input
          type="number"
          value={maxTests}
          onChange={(e) => setMaxTests(Math.max(1, parseInt(e.target.value) || 1))}
          className="px-3 py-2 border border-gray-300 rounded-md w-20"
          min="1"
          max="100"
          disabled={isRunning}
        />
        <label className="text-sm text-gray-600">Max tests to run</label>
        
        <div className="flex-1"></div>
        
        <button
          onClick={isRunning ? stopTesting : startTesting}
          className={`px-6 py-2 rounded-md font-medium ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isRunning ? 'Stop Testing' : 'Start Testing'}
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h4 className="text-sm font-medium text-gray-900">Test Results</h4>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No test results yet. Click "Start Testing" to begin.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {testResults.slice().reverse().map((result, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      result.success ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {result.message}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.duration}ms
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        This tool sends accessibility scan requests every 5 seconds to test the job queue system performance and reliability.
      </div>
    </div>
  );
};

export default JobQueueTester;