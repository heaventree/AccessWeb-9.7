import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Interface for UI component demos
interface ComponentDemo {
  id: string;
  name: string;
  description: string;
  component: React.ReactNode;
}

// UI Kit Preview Page
const UIKitPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Define the component demos that will be shown in the preview
  const componentDemos: ComponentDemo[] = [
    {
      id: 'theme-toggle',
      name: 'Theme Toggle',
      description: 'Modern theme toggle component with automatic mode detection',
      component: <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">Theme Toggle Demo</h3>
        <p className="mb-4">The actual toggle implementation will be added here.</p>
        <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full transition">
          Toggle Theme (Placeholder)
        </button>
      </div>
    },
    {
      id: 'wcag-badge',
      name: 'WCAG Badge',
      description: 'Displays accessibility compliance levels (A, AA, AAA)',
      component: <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">WCAG Badge Demo</h3>
        <div className="flex gap-4">
          <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">WCAG A</div>
          <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">WCAG AA</div>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">WCAG AAA</div>
        </div>
      </div>
    },
    {
      id: 'contrast-checker',
      name: 'Contrast Checker',
      description: 'Utility to validate color combinations for accessibility',
      component: <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-lg font-medium mb-2">Contrast Checker Demo</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-teal-500 text-white rounded">
            <span>Contrast Ratio: 4.8:1</span>
            <div className="mt-2 px-2 py-1 bg-white/20 rounded text-sm inline-block">
              AA Pass ✓
            </div>
          </div>
          <div className="p-4 bg-yellow-200 text-gray-900 rounded">
            <span>Contrast Ratio: 14.2:1</span>
            <div className="mt-2 px-2 py-1 bg-black/10 rounded text-sm inline-block">
              AAA Pass ✓
            </div>
          </div>
        </div>
      </div>
    },
    {
      id: 'app-shell',
      name: 'App Shell',
      description: 'Main application layout with responsive design',
      component: <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex flex-col h-64 border border-gray-200 dark:border-gray-700 rounded">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex flex-1">
            <div className="w-1/5 border-r border-gray-200 dark:border-gray-700 p-3">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="flex-1 p-3">
              <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          AccessWebPro UI Kit Preview
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This is a non-destructive preview of the new UI Kit components being developed for ACCESS-WEB-V9.7.
          These components are based on the design system found in the UI KIT - NEW folder.
        </p>
        <div className="flex gap-2">
          <Link 
            to="/"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition"
          >
            Back to Home
          </Link>
          <Link 
            to="/tools/colors"
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition"
          >
            Color Palette Tool
          </Link>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 border-b-2 ${
                activeTab === 'overview'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 border-b-2 ${
                activeTab === 'components'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('components')}
            >
              Components
            </button>
          </li>
          <li className="mr-2">
            <button
              className={`inline-block py-2 px-4 border-b-2 ${
                activeTab === 'theme'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('theme')}
            >
              Theme System
            </button>
          </li>
          <li>
            <button
              className={`inline-block py-2 px-4 border-b-2 ${
                activeTab === 'integration'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('integration')}
            >
              Integration Plan
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">UI Kit Overview</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The new AccessWebPro UI Kit is designed with a modern, minimalist aesthetic that prioritizes 
              accessibility while maintaining a visually appealing interface. The design uses teal/mint 
              accent colors (#0fae96) alongside primary blue (#0066FF), with a focus on:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 ml-4">
              <li>Gradient backgrounds</li>
              <li>Pill-shaped buttons</li>
              <li>Floating cards with light shadows</li>
              <li>Strong focus on WCAG compliance</li>
              <li>Built-in accessibility tools</li>
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gradient-to-br from-teal-500/90 to-blue-500/90 p-6 rounded-lg text-white">
                <h3 className="text-xl font-bold mb-2">Modern Theme System</h3>
                <p>CSS variables-based theming with light and dark mode support</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/90 to-pink-500/90 p-6 rounded-lg text-white">
                <h3 className="text-xl font-bold mb-2">Accessibility-First</h3>
                <p>Components designed to meet WCAG AA and AAA standards</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">UI Components</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The UI Kit includes a variety of components designed for accessibility and usability. 
              Below are some examples of the components that will be available in the new UI Kit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {componentDemos.map((demo) => (
                <div key={demo.id} className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{demo.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{demo.description}</p>
                  {demo.component}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'theme' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Theme System</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The theme system is built on CSS variables for consistent styling across the application while
              supporting both light and dark modes. The system is designed to be easy to customize and extend.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Primary Colors</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md bg-[#0fae96] mr-3"></div>
                    <div>
                      <p className="font-medium">#0fae96</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Primary Teal</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md bg-[#0066FF] mr-3"></div>
                    <div>
                      <p className="font-medium">#0066FF</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Secondary Blue</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md bg-[#10b981] mr-3"></div>
                    <div>
                      <p className="font-medium">#10b981</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Success Green</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md bg-[#f59e0b] mr-3"></div>
                    <div>
                      <p className="font-medium">#f59e0b</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Warning Amber</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-md bg-[#ef4444] mr-3"></div>
                    <div>
                      <p className="font-medium">#ef4444</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Danger Red</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Theme Implementation</h3>
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-auto">
                  <pre className="text-sm text-gray-800 dark:text-gray-200">
{`:root {
  /* Base colors */
  --color-primary: #0fae96;
  --color-secondary: #0066FF;
  
  /* Semantic meanings */
  --background: #f9fafb;
  --foreground: #111827;
  --card: #ffffff;
  --card-foreground: #111827;
  
  /* Component-specific */
  --button-primary-bg: var(--color-primary);
  --button-primary-text: white;
}

.dark {
  --background: #030712;
  --foreground: #f9fafb;
  --card: #1f2937;
  --card-foreground: #f9fafb;
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integration' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Integration Plan</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The UI Kit is designed to be gradually integrated into the existing application. This phased approach
              minimizes risk and allows for proper testing at each stage.
            </p>
            <div className="space-y-6 mt-6">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Phase 1: Core Theme</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4">
                  <li>Import CSS variables</li>
                  <li>Implement theme toggle</li>
                  <li>Update global styles</li>
                </ul>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Phase 2: Basic Components</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4">
                  <li>Update buttons, inputs, and cards</li>
                  <li>Implement WCAG badges</li>
                  <li>Add contrast checker utility</li>
                </ul>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Phase 3: Layout Components</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4">
                  <li>Implement new navigation</li>
                  <li>Update page layouts</li>
                  <li>Integrate sidebar components</li>
                </ul>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Phase 4: Advanced Features</h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 ml-4">
                  <li>Implement specialized tool interfaces</li>
                  <li>Add data visualization components</li>
                  <li>Finalize accessibility features</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UIKitPreview;