import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  PlayCircle, 
  ArrowRight,
  Activity,
  Shield,
  BarChart4,
  RefreshCw,
  Code2
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-28 pb-16 md:pb-32 bg-gradient-to-b from-[#f9fdff] to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-block px-4 py-1.5 bg-[#e0f5f1] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4] rounded-full font-medium text-sm mb-6">
                Introducing the industry standard for WCAG compliance
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 text-transparent bg-clip-text">
                Make Your Website Accessible to <span className="text-primary dark:text-[#5eead4]">Everyone</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Automated WCAG compliance testing and monitoring to ensure your website is accessible to all users. Get detailed reports and fixes in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 transition-all duration-300 rounded-full px-8 py-6 text-white"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5 inline-block" />
                </button>
                <button 
                  onClick={() => navigate('/demo')}
                  className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-[#5eead4] transition-colors rounded-full px-8 py-6"
                >
                  <PlayCircle className="mr-2 h-5 w-5 text-primary dark:text-[#5eead4] inline-block" />
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
                <img 
                  src="https://images.unsplash.com/photo-1573167710701-35950a41e251?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="AccessWebPro dashboard showing accessibility compliance metrics" 
                  className="w-full h-auto"
                />
              </div>
              
              {/* Trust indicators */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-between opacity-70 dark:opacity-50">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 mx-auto dark:invert" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" className="h-6 mx-auto dark:invert" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-6 mx-auto dark:invert" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" className="h-5 mx-auto dark:invert" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-5 mx-auto dark:invert" />
              </div>
              
              {/* Floating certification badge */}
              <div className="absolute -bottom-10 right-8 md:right-10 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg max-w-xs border border-gray-100 dark:border-gray-700">
                <div className="flex items-center text-[#0fae96] dark:text-[#5eead4] mb-2">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-semibold">WCAG 2.1 AA Certified</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Verify your site meets accessibility standards in minutes</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-10 shadow-md border border-gray-100 dark:border-gray-700 max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">500+</p>
                  <p className="text-gray-600 dark:text-gray-400">Organizations</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">10k+</p>
                  <p className="text-gray-600 dark:text-gray-400">Websites Checked</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">98%</p>
                  <p className="text-gray-600 dark:text-gray-400">Accuracy Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">24/7</p>
                  <p className="text-gray-600 dark:text-gray-400">Expert Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32 bg-[#f9fdff] dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-1.5 bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4] rounded-full mb-6">
                Unleash advanced capabilities
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Everything You Need for WCAG Compliance</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Comprehensive accessibility testing and monitoring in one powerful platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-[#e0f5f1] dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                  <Activity className="text-[#0fae96] w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Automated Testing</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Scan your entire website automatically for WCAG 2.1 compliance issues</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">AI-powered scanning engine with up to 97% accuracy</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Comprehensive issue detection across all pages</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Scheduled automatic scans at your preferred frequency</span>
                  </li>
                </ul>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-[#e7f5ff] dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="text-primary w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Real-time Fixes</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Get instant recommendations and code snippets to fix accessibility issues</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">One-click fix application with rollback options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Code snippet recommendations for developer implementation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Guided remediation steps with priority indicators</span>
                  </li>
                </ul>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-[#eeeaff] dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                  <BarChart4 className="text-purple-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Detailed Reports</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Generate comprehensive reports for stakeholders and compliance records</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">WCAG criteria breakdown with severity indicators</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Exportable compliance documents in multiple formats</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Progress tracking dashboard with historical data</span>
                  </li>
                </ul>
              </div>

              {/* Feature Card 4 */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-[#ffede8] dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                  <RefreshCw className="text-orange-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Continuous Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Always-on monitoring to catch accessibility issues before users do</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Real-time accessibility alerts via email, Slack, or SMS</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Content update scanning triggered by site changes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Downtime accessibility validation and reporting</span>
                  </li>
                </ul>
              </div>

              {/* Feature Card 5 */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-[#fef8e0] dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                  <Code2 className="text-yellow-600 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Developer Tools</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Integrate accessibility testing into your development workflow</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">RESTful API integration with comprehensive documentation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">CI/CD pipeline compatibility for pre-deployment testing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Custom webhook notifications for your tech stack</span>
                  </li>
                </ul>
              </div>

              {/* Feature Card 6 */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-lg h-full">
                <div className="w-14 h-14 bg-[#e5f4ff] dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="text-blue-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Legal Compliance</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Support for global accessibility standards and legal requirements</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Coverage for WCAG 2.1, Section 508, ADA, and AODA</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Legal compliance documentation and audit trails</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Expert guidance on regional accessibility requirements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-[#e0f5f1]/50 to-white dark:from-[#0fae96]/10 dark:to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Ready to make your website accessible to everyone?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join thousands of organizations that trust AccessWebPro to ensure their
                digital presence is accessible to all users.
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-primary hover:bg-primary/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors"
                >
                  Get Started Free
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}