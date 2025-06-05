import React from 'react';
import { JobQueueTester } from '@/components/testing/JobQueueTester';

const JobQueueTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Job Queue Testing Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Test the accessibility scanning job queue system with rapid 15-second scheduling intervals. 
            This tool verifies the performance and reliability of automated WCAG compliance testing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Job Queue</span>
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Worker Pool</span>
                <span className="text-sm font-medium text-green-600">3 Workers</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Testing Schedule</span>
                <span className="text-sm font-medium text-blue-600">1 Minute</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Manual Triggers</span>
                <span className="text-sm font-medium text-green-600">Enabled</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                Automated WCAG compliance testing
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                Real-time job queue monitoring
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                Configurable scan frequencies
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                Performance metrics tracking
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                Error handling and recovery
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-semibold text-gray-900">Test Options</h3>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <strong>Testing Schedule:</strong> Every 1 minute for rapid verification
              </div>
              <div className="text-sm text-gray-600">
                <strong>Manual Triggers:</strong> Instant accessibility scans on demand
              </div>
              <div className="text-sm text-gray-600">
                <strong>Performance:</strong> Real-time response time monitoring
              </div>
              <div className="text-sm text-gray-600">
                <strong>Reliability:</strong> Success rate tracking and error logging
              </div>
            </div>
          </div>
        </div>

        <JobQueueTester connectionId={8} />

        <div className="mt-8 bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            About the Testing System
          </h3>
          <div className="prose text-gray-600">
            <p className="mb-4">
              This testing dashboard demonstrates the complete accessibility scanning job queue system 
              with rapid scheduling capabilities. The system uses pg-boss for reliable job processing 
              and PostgreSQL for persistent storage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technical Features</h4>
                <ul className="space-y-1 text-sm">
                  <li>• PostgreSQL-backed job queue with pg-boss</li>
                  <li>• Concurrent job processing with configurable limits</li>
                  <li>• Automatic retry logic for failed scans</li>
                  <li>• Real-time job status monitoring</li>
                  <li>• Database synchronization every 5 minutes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Schedule Options</h4>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Testing:</strong> Every 1 minute (for verification)</li>
                  <li>• <strong>Daily:</strong> Every day at 9 AM</li>
                  <li>• <strong>Weekly:</strong> Every Monday at 9 AM</li>
                  <li>• <strong>Monthly:</strong> 1st of each month at 9 AM</li>
                  <li>• <strong>Manual:</strong> On-demand scan triggers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobQueueTestPage;