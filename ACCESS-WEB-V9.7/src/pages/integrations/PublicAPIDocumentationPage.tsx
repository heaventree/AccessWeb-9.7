import React from 'react';
import { Code, Key, BookOpen, ArrowRight, CheckCircle, Zap, Shield, Settings } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function PublicAPIDocumentationPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-slate-800 dark:bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 text-white">AccessWeb API</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Integrate WCAG accessibility testing directly into your development workflow. 
              Get comprehensive compliance reports programmatically.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-700 dark:bg-slate-800 rounded-xl p-6 border border-slate-600">
              <div className="bg-[#0fae96] rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">One-Click Integration</h3>
              <p className="text-slate-300 leading-relaxed">
                Integrate directly into your development pipeline - no complex setup required.
              </p>
            </div>

            <div className="bg-slate-700 dark:bg-slate-800 rounded-xl p-6 border border-slate-600">
              <div className="bg-[#0fae96] rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Automated Compliance</h3>
              <p className="text-slate-300 leading-relaxed">
                Continuous monitoring and automated fixes keep your site WCAG compliant.
              </p>
            </div>

            <div className="bg-slate-700 dark:bg-slate-800 rounded-xl p-6 border border-slate-600">
              <div className="bg-[#0fae96] rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Framework Compatibility</h3>
              <p className="text-slate-300 leading-relaxed">
                Works with any development framework and popular CI/CD tools.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">API Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Comprehensive WCAG Testing
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Full WCAG 2.1 and 2.2 compliance testing with detailed violation reports and remediation guidance.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Multiple Standards Support
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Support for US Section 508, EU EN 301 549, and international accessibility standards.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Real-time Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fast, server-side accessibility analysis using the latest axe-core engine.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Reliable
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enterprise-grade security with API key authentication and rate limiting.
              </p>
            </div>
          </div>
        </div>

        {/* API Documentation */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">API Documentation</h2>
          
          {/* Endpoint */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
              WCAG Compliance Check
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded p-4 text-sm border dark:border-gray-600">
              <code className="block text-gray-900 dark:text-gray-100">
                <span className="text-green-600 dark:text-green-400 font-semibold">POST</span> /api/public/wcag-check
              </code>
            </div>
          </div>

          {/* Request Example */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Request Example</h4>
            <div className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm text-gray-100">
{`curl -X POST https://your-domain.com/api/public/wcag-check \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com",
    "region": "us",
    "tag": "WCAG2AA"
  }'`}
              </pre>
            </div>
          </div>

          {/* Parameters */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Parameters</h4>
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Parameter
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">url</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">string</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded text-xs font-medium mr-2">
                        Required
                      </span>
                      The URL to test for accessibility compliance
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">region</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">string</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      Regional compliance standard: "us", "eu", or "uk" (default: "us")
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900 dark:text-white">tag</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">string</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      WCAG level: "WCAG2A", "WCAG2AA", "WCAG2AAA", "SECTION508", "EN301549" (default: "WCAG2AA")
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>


        </div>

        {/* Authentication */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Authentication</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6">
            <div className="flex items-start">
              <Key className="h-6 w-6 text-yellow-500 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">API Key Required</h3>
                <p className="text-yellow-800 dark:text-yellow-200 mb-4">
                  To use the AccessWeb API, you need to create an account and generate an API key.
                </p>
                <Button
                  onClick={() => navigate('/auth/login')}
                  className="bg-[#0fae96] hover:bg-[#0fae96]/90 text-white"
                >
                  Create Account & Get API Key
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Rate Limits</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0fae96] mb-1">1,000</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Requests per hour</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0fae96] mb-1">10</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Concurrent requests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#0fae96] mb-1">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Uptime SLA</div>
              </div>
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="text-center bg-gradient-to-r from-[#0fae96] to-[#0d9488] rounded-lg p-8 text-white">
          <BookOpen className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-green-100 mb-6">
            Create your account today and start integrating accessibility testing into your workflow.
          </p>
          <Button
            onClick={() => navigate('/auth/login')}
            className="bg-white text-[#0fae96] hover:bg-gray-100 text-lg px-8 py-3"
          >
            Sign Up Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}