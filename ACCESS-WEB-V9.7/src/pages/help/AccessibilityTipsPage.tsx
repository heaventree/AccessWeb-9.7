import React from 'react';
import AccessibilityTipsPanel from '../../components/accessibility/AccessibilityTipsPanel';
import { PageHeader } from '../../components/ui/PageHeader';

const AccessibilityTipsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[130px] pb-[80px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Accessibility Quick Tips"
          description="Browse our comprehensive library of accessibility tips categorized by element type and WCAG requirements."
        />
        
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <AccessibilityTipsPanel />
        </div>
        
        <div className="mt-12 bg-[#0fae96]/5 dark:bg-[#0fae96]/10 p-6 rounded-xl border border-[#0fae96]/10 dark:border-[#0fae96]/20 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
              <svg className="h-5 w-5 text-[#0fae96] dark:text-[#5eead4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            How to Use Accessibility Tips
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Our Accessibility Quick Tips feature provides context-sensitive guidance as you navigate through
            your website or application. Here's how to make the most of it:
          </p>
          
          <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300">
            <li>
              <strong className="text-gray-900 dark:text-white">Look for the tip indicator</strong> - Blue question mark icons indicate elements with
              accessibility tips.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Hover over elements</strong> - Move your cursor over elements with tip indicators to
              view accessibility guidelines.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Check WCAG references</strong> - Each tip includes the relevant WCAG success criterion
              for deeper understanding.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Follow "Learn more" links</strong> - For detailed guidance, click the learn more links
              to access comprehensive documentation.
            </li>
            <li>
              <strong className="text-gray-900 dark:text-white">Enable/disable tips</strong> - Toggle tips on or off using the switch in the Accessibility Toolbar.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityTipsPage;