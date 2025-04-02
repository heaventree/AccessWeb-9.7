import { Link } from 'react-router-dom';
import { FileText, Code, Globe, Book } from 'lucide-react';

export function DocumentationPage() {
  const documentationSections = [
    {
      title: 'API Documentation',
      description: 'Integrate our accessibility tools into your applications',
      icon: Code,
      link: '/docs/api',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    },
    {
      title: 'WCAG Resources',
      description: 'Detailed explanations of WCAG 2.1 requirements',
      icon: Book,
      link: '/wcag-resources',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    },
    {
      title: 'Integration Guides',
      description: 'Implement accessibility checks in your CMS',
      icon: Globe,
      link: '/integrations',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    },
    {
      title: 'User Guides',
      description: 'Learn how to use our accessibility tools',
      icon: FileText,
      link: '/help',
      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Documentation</h1>
        <p className="mt-3 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Everything you need to know about implementing and using our accessibility tools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {documentationSections.map((section) => (
          <Link
            key={section.title}
            to={section.link}
            className="group flex flex-col h-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-all duration-200 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center p-6">
              <div className={`p-3 rounded-lg ${section.color}`}>
                <section.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {section.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {section.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Getting Started
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          New to AccessWeb? Here are some resources to help you get started:
        </p>
        <div className="space-y-3">
          <Link
            to="/docs/api"
            className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            <Code className="w-5 h-5 mr-2" />
            API Quick Start Guide
          </Link>
          <Link
            to="/help"
            className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            <FileText className="w-5 h-5 mr-2" />
            User Guides
          </Link>
          <Link
            to="/wcag-resources"
            className="flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
          >
            <Book className="w-5 h-5 mr-2" />
            WCAG Resource Library
          </Link>
        </div>
      </div>

      <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Need Help?
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Our support team is available to assist you with any questions.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/help"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}