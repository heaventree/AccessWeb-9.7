import React from 'react';
import { Code, Key, Book, CheckCircle, Webhook, ArrowRight, Shield, Zap, FileText, AlertTriangle, Globe, Package, Clock, DollarSign, Lock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export function APIGuide() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[130px] pb-[80px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">API Documentation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Complete guide to integrating accessibility testing into your applications. Features and capabilities vary by subscription plan.
          </p>
        </div>

        {/* Subscription Plans */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-slate-700">
          <div className="p-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <Package className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Available API Plans</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Basic Plan</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Up to 1,000 API calls/month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Basic accessibility reports</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Standard rate limiting</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#0fae96]/5 dark:bg-[#0fae96]/10 rounded-xl p-6 border border-[#0fae96]/10 dark:border-[#0fae96]/20 hover:shadow-md transition-all duration-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Professional Plan</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Up to 10,000 API calls/month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Advanced reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Webhook integrations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Higher rate limits</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Enterprise Plan</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Unlimited API calls</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Custom integrations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mt-0.5 mr-2 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">Custom rate limits</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Availability */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-slate-700">
          <div className="p-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <Key className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Features & Permissions</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                <thead className="bg-gray-50 dark:bg-slate-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Feature</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Basic</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Professional</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">AI-Powered Fixes</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Fix Suggestions</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Basic Only</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Advanced</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">WCAG Testing</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">A/AA Only</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">A/AA/AAA</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Custom Tests</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">API Rate Limits</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">1,000/month</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">10,000/month</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Webhooks</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Real-Time Monitoring</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Report Formats</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">PDF Only</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">PDF, CSV, JSON</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">All + Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Integrations</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Basic API</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">All Platforms</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Analytics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Basic</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Advanced</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Support</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">❌</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">✅</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">✅</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Support SLA</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Standard</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Priority</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Custom</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 bg-[#0fae96]/5 dark:bg-[#0fae96]/10 p-4 rounded-xl border border-[#0fae96]/10 dark:border-[#0fae96]/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-[#0fae96] dark:text-[#5eead4]" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Feature Availability</h3>
                  <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                    <p>Features like AI-powered fixes and advanced monitoring require higher tier subscriptions to ensure optimal performance and support. Upgrade your plan to unlock additional capabilities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-slate-700">
          <div className="p-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <Clock className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Rate Limits</h2>
            </div>

            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>API rate limits are enforced based on your subscription plan:</p>
              
              <ul className="space-y-2 list-disc pl-6">
                <li><strong className="text-gray-900 dark:text-white">Basic Plan:</strong> 60 requests per minute, 1,000 per month</li>
                <li><strong className="text-gray-900 dark:text-white">Professional Plan:</strong> 300 requests per minute, 10,000 per month</li>
                <li><strong className="text-gray-900 dark:text-white">Enterprise Plan:</strong> Custom limits based on your needs</li>
              </ul>

              <p>Rate limit headers are included in all API responses:</p>

              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 border border-gray-700 dark:border-slate-600 overflow-x-auto">
                {`X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1500000000`}
              </pre>
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-slate-700">
          <div className="p-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <Lock className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authentication</h2>
            </div>

            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                All API requests must include your API key in the Authorization header:
              </p>

              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 border border-gray-700 dark:border-slate-600 overflow-x-auto">
                {`Authorization: Bearer your_api_key_here`}
              </pre>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/30 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Important</h3>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      Keep your API keys secure and never expose them in client-side code.
                      Rotate your keys immediately if they are compromised.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-slate-700 border border-gray-200 dark:border-slate-700">
          {/* Quick Start Section */}
          <div id="quick-start" className="p-8">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <Zap className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Start</h2>
            </div>

            <div className="text-gray-700 dark:text-gray-300 space-y-6">
              <p>
                Get started with our API in minutes. Follow these steps to integrate accessibility testing into your applications.
              </p>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Get Your API Key</h3>
                <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 mb-6 border border-gray-700 dark:border-slate-600 overflow-x-auto">
                  {`curl -X POST https://api.accessweb.com/v1/api-keys \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My API Key"}'`}
                </pre>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Make Your First Request</h3>
                <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 mb-6 border border-gray-700 dark:border-slate-600 overflow-x-auto">
                  {`curl -X POST https://api.accessweb.com/v1/scan \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "options": {
      "waitForTimeout": 5000,
      "maxPages": 10
    }
  }'`}
                </pre>
              </div>
            </div>
          </div>

          {/* API Reference Section */}
          <div id="api-reference" className="p-8">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <Code className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Reference</h2>
            </div>

            <div className="space-y-8">
              {/* Scans Endpoints */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Scans</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full">POST</span>
                      <code className="ml-2 text-sm font-mono text-gray-900 dark:text-gray-300">/scans</code>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400 mb-2">Start a new accessibility scan</p>
                    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm border border-gray-700 dark:border-slate-600 overflow-x-auto">
                      {`{
  "url": "https://example.com",
  "options": {
    "waitForTimeout": 5000,
    "maxPages": 10
  }
}`}
                    </pre>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full">GET</span>
                      <code className="ml-2 text-sm font-mono text-gray-900 dark:text-gray-300">/scans/{'{scan_id}'}</code>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400">Get scan results</p>
                  </div>
                </div>
              </div>

              {/* Issues Endpoints */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Issues</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full">GET</span>
                      <code className="ml-2 text-sm font-mono text-gray-900 dark:text-gray-300">/issues/{'{issue_id}'}</code>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400">Get issue details</p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full">GET</span>
                      <code className="ml-2 text-sm font-mono text-gray-900 dark:text-gray-300">/issues/{'{issue_id}'}/fixes</code>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400">Get suggested fixes</p>
                  </div>
                </div>
              </div>

              {/* Webhooks Endpoints */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Webhooks</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
                    <div className="flex items-center mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-full">POST</span>
                      <code className="ml-2 text-sm font-mono text-gray-900 dark:text-gray-300">/webhooks</code>
                    </div>
                    <p className="text-gray-700 dark:text-gray-400 mb-2">Register a new webhook</p>
                    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-sm border border-gray-700 dark:border-slate-600 overflow-x-auto">
                      {`{
  "url": "https://your-domain.com/webhook",
  "events": ["scan.completed", "issue.found"]
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Handling Section */}
          <div id="error-handling" className="p-8">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <AlertTriangle className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Error Handling</h2>
            </div>

            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>The API uses standard HTTP response codes and returns errors in a consistent format:</p>
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 border border-gray-700 dark:border-slate-600 overflow-x-auto">
                {`{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Rate limit exceeded",
    "details": {
      "limit": 60,
      "remaining": 0,
      "reset": 1500000000
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 bg-[#0fae96] dark:bg-[#0fae96]/80 rounded-xl shadow-sm p-8 text-center border border-[#0fae96]/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Sign up for a free trial to get your API key and start integrating accessibility testing into your applications.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-[#0fae96] bg-white hover:bg-gray-50 transition-colors"
          >
            Start Free Trial
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}