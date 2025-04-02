import { useState } from 'react';
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { RoadmapFeaturesList } from '../components/RoadmapFeaturesList';

export function RoadmapPage() {
  const [showLess, setShowLess] = useState(false);

  const toggleShowLess = () => {
    setShowLess(!showLess);
  };

  return (
    <div className="page-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-display">
            Product Roadmap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our upcoming features and enhancements to make your website more accessible
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Completed Features</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">PDF accessibility testing</h3>
                <p className="text-gray-600">Integrated PDF document accessibility evaluation with detailed reporting and fix suggestions</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Fixed CORS issues</h3>
                <p className="text-gray-600">Improved web page fetching mechanism with multiple proxy fallbacks</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Enhanced error reporting</h3>
                <p className="text-gray-600">Enhanced error reporting and logging in network operations</p>
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Fixed TypeScript errors</h3>
                <p className="text-gray-600">Fixed TypeScript errors and code quality issues</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Current Development</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <AlertCircle className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-gray-900">Media Accessibility Testing</h3>
                <p className="text-gray-600">Support for evaluating media elements (audio, video) on web pages</p>
                <ul className="mt-2 space-y-1 ml-4 text-gray-600">
                  <li>• Audio transcription validation</li>
                  <li>• Video caption verification</li>
                  <li>• Media player accessibility controls checking</li>
                  <li>• Support for WCAG 2.1 time-based media requirements</li>
                </ul>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Features</h2>
          <RoadmapFeaturesList />
          
          <div className="pt-4 text-center">
            <button
              onClick={toggleShowLess}
              className="inline-flex items-center text-gray-700 hover:text-gray-900"
            >
              {showLess ? (
                <>
                  Show more
                  <ChevronDown className="ml-1 h-5 w-5" />
                </>
              ) : (
                <>
                  Show less
                  <ChevronUp className="ml-1 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Long-Term Vision</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0 mt-0.5 flex items-center justify-center">
                <span className="text-lg font-bold">•</span>
              </div>
              <p className="text-gray-600">Develop a comprehensive WCAG 2.2 compliance dashboard</p>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0 mt-0.5 flex items-center justify-center">
                <span className="text-lg font-bold">•</span>
              </div>
              <p className="text-gray-600">Create an API for automated accessibility testing</p>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0 mt-0.5 flex items-center justify-center">
                <span className="text-lg font-bold">•</span>
              </div>
              <p className="text-gray-600">Establish accessibility monitoring system for continuous testing</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}