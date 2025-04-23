import React from 'react';
import { Code, BookOpen, Layout, Zap, Shield, AlertTriangle, CheckCircle, ArrowRight, Settings, FileCode } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * WordPress Guide Page Component with updated styling to match the new UI Kit
 */
export const WordPressGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[130px] pb-[80px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">WordPress Integration Guide</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Learn how to integrate our accessibility testing tools with your WordPress site to ensure compliance with WCAG standards.
          </p>
        </div>

        {/* Overview Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-slate-700">
          <div className="p-8 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <BookOpen className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">WordPress Integration Overview</h2>
            </div>
            
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                Our WordPress plugin provides seamless integration with the world's most popular CMS, offering 
                automated accessibility scanning and fixes directly within your WordPress admin dashboard.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <Zap className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Easy Setup</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Install our plugin from the WordPress plugin directory in just a few clicks.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <Shield className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">WCAG Compliance</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Ensure your WordPress site meets WCAG 2.1 and 2.2 standards for maximum accessibility.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-slate-900 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center mb-4">
                    <Layout className="w-5 h-5 text-[#0fae96] dark:text-[#5eead4] mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Theme Compatibility</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Works with any WordPress theme, including popular options like Elementor, Divi, and Avada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Section */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-slate-700">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <Code className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Installation Guide</h2>
            </div>
            
            <div className="text-gray-700 dark:text-gray-300 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1. Install the Plugin</h3>
                <p className="mb-4">Go to your WordPress admin dashboard, navigate to Plugins {'>'} Add New, and search for "AccessWeb" or download it directly from the <a href="#" className="text-[#0fae96] dark:text-[#5eead4] hover:underline">WordPress Plugin Directory</a>.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2. Activate and Configure</h3>
                <p className="mb-4">Activate the plugin and navigate to AccessWeb settings to configure your API key and scanning preferences.</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3. Run Your First Scan</h3>
                <p className="mb-4">Use the dashboard widget or go to AccessWeb {'>'} Scan to perform your first accessibility check.</p>
              </div>

              <div className="bg-[#0fae96]/5 dark:bg-[#0fae96]/10 p-4 rounded-xl border border-[#0fae96]/10 dark:border-[#0fae96]/20 mt-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-[#0fae96] dark:text-[#5eead4]" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">Important Note</h3>
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                      <p>Ensure your WordPress installation is updated to the latest version before installing our plugin. We recommend backing up your site before making any changes to your theme files.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Configuration */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm mb-12 border border-gray-200 dark:border-slate-700">
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-2 inline-block mr-3">
                <Settings className="w-6 h-6 text-[#0fae96] dark:text-[#5eead4]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Configuration</h2>
            </div>
            
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                Power users can customize the integration using our advanced settings and hooks:
              </p>
              
              <div className="bg-gray-900 text-gray-100 rounded-xl p-4 border border-gray-700 dark:border-slate-600 overflow-x-auto my-4">
                <pre className="text-sm">
{`// Add this to your theme's functions.php file
add_filter('accessweb_scan_options', function($options) {
    $options['checkContrast'] = true;
    $options['scanFrequency'] = 'daily';
    return $options;
});`}
                </pre>
              </div>
              
              <p>
                See our <a href="#" className="text-[#0fae96] dark:text-[#5eead4] hover:underline">developer documentation</a> for more advanced configuration options.
              </p>
            </div>
          </div>
        </div>

        {/* Support & Resources Section */}
        <div className="mt-12 bg-[#0fae96] dark:bg-[#0fae96]/80 rounded-xl shadow-sm p-8 text-center border border-[#0fae96]/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            Need Help With Your WordPress Integration?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Our support team is ready to assist with installation, configuration, or customizing our plugin for your specific WordPress setup.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-[#0fae96] bg-white hover:bg-gray-50 transition-colors"
          >
            Contact Support
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WordPressGuide;