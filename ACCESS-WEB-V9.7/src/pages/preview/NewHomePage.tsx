import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PlayCircle, 
  CheckCircle, 
  ArrowRight, 
  Check, 
  Activity,
  BarChart4,
  Shield,
  Code2,
  RefreshCw
} from 'lucide-react';

// Preview of new Home Page based on UI Kit design
const NewHomePage: React.FC = () => {
  const [isTrialSubmitting, setIsTrialSubmitting] = useState(false);
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);

  // Function to handle free trial signup
  const handleTrialSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsTrialSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsTrialSubmitting(false);
      alert('Trial signup successful! This is a preview only.');
    }, 1000);
  };

  // Function to handle newsletter signup
  const handleNewsletterSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsNewsletterSubmitting(false);
      alert('Newsletter signup successful! This is a preview only.');
    }, 1000);
  };

  return (
    <div className="relative">
      {/* Hero Section - Based on hero-section.tsx from UI Kit */}
      <section className="pt-28 pb-16 md:pb-32 bg-gradient-to-b from-[#f9fdff] to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block px-4 py-1.5 bg-[#e0f5f1] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4] rounded-full font-medium text-sm mb-6">
                Introducing the industry standard for WCAG compliance
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 text-transparent bg-clip-text">
                Make Your Website Accessible to <span className="text-[#0fae96] dark:text-[#5eead4]">Everyone</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                Automated WCAG compliance testing and monitoring to ensure your website is accessible to all users. Get detailed reports and fixes in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <form onSubmit={handleTrialSignup} className="flex-shrink-0">
                  <button 
                    type="submit" 
                    disabled={isTrialSubmitting}
                    className="w-full sm:w-auto bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 transition-all duration-300 rounded-full px-8 py-6 text-white font-medium"
                  >
                    {isTrialSubmitting ? "Starting..." : "Start Free Trial"} <ArrowRight className="ml-2 h-5 w-5 inline" />
                  </button>
                </form>
                <button 
                  className="border-gray-300 dark:border-gray-600 hover:border-[#0fae96] dark:hover:border-[#5eead4] transition-colors rounded-full px-8 py-6 border font-medium"
                >
                  <PlayCircle className="mr-2 h-5 w-5 text-[#0fae96] dark:text-[#5eead4] inline" />
                  Watch Demo
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="relative max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                  AccessWebPro Dashboard Preview
                </div>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-between opacity-70 dark:opacity-50">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto w-24"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto w-24"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto w-24"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto w-24"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mx-auto w-24"></div>
            </div>
            
            {/* Floating certification badge */}
            <div className="absolute -bottom-10 right-8 md:right-10 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg max-w-xs border border-gray-100 dark:border-gray-700">
              <div className="flex items-center text-[#0fae96] dark:text-[#5eead4] mb-2">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-semibold">WCAG 2.1 AA Certified</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">Verify your site meets accessibility standards in minutes</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Based on stat-section.tsx from UI Kit */}
      <section className="py-16 bg-white dark:bg-gray-800 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            <div className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">10M+</h3>
              <p className="text-gray-600 dark:text-gray-300">Pages Scanned Monthly</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">97%</h3>
              <p className="text-gray-600 dark:text-gray-300">Issue Detection Accuracy</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">15k+</h3>
              <p className="text-gray-600 dark:text-gray-300">Happy Customers</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">60%</h3>
              <p className="text-gray-600 dark:text-gray-300">Average Fix Time Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Based on feature-section.tsx from UI Kit */}
      <section id="features" className="py-24 md:py-32 bg-[#f9fdff] dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-[#e0f5f1] dark:bg-[#0fae96]/20 text-[#0fae96] dark:text-[#5eead4] border-0 rounded-full px-4 py-1 mb-6">
              Unleash advanced capabilities
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Everything You Need for WCAG Compliance</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive accessibility testing and monitoring in one powerful platform
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Activity />,
                title: "Automated Testing",
                description: "Scan your entire website automatically for WCAG 2.1 compliance issues",
                bulletPoints: [
                  "AI-powered scanning engine with up to 97% accuracy",
                  "Comprehensive issue detection across all pages",
                  "Scheduled automatic scans at your preferred frequency"
                ],
                bgColor: "bg-[#e0f5f1]",
                iconColor: "text-[#0fae96]",
                index: 0
              },
              {
                icon: <Shield />,
                title: "Real-time Fixes",
                description: "Get instant recommendations and code snippets to fix accessibility issues",
                bulletPoints: [
                  "One-click fix application with rollback options",
                  "Code snippet recommendations for developer implementation",
                  "Guided remediation steps with priority indicators"
                ],
                bgColor: "bg-[#e7f5ff]",
                iconColor: "text-[#0fae96]",
                index: 1
              },
              {
                icon: <BarChart4 />,
                title: "Detailed Reports",
                description: "Generate comprehensive reports for stakeholders and compliance records",
                bulletPoints: [
                  "WCAG criteria breakdown with severity indicators",
                  "Exportable compliance documents in multiple formats",
                  "Progress tracking dashboard with historical data"
                ],
                bgColor: "bg-[#eeeaff]",
                iconColor: "text-purple-600",
                index: 2
              },
              {
                icon: <RefreshCw />,
                title: "Continuous Monitoring",
                description: "Always-on monitoring to catch accessibility issues before users do",
                bulletPoints: [
                  "Real-time accessibility alerts via email, Slack, or SMS",
                  "Content update scanning triggered by site changes",
                  "Downtime accessibility validation and reporting"
                ],
                bgColor: "bg-[#ffede8]",
                iconColor: "text-orange-500",
                index: 3
              },
              {
                icon: <Code2 />,
                title: "Developer Tools",
                description: "Integrate accessibility testing into your development workflow",
                bulletPoints: [
                  "RESTful API integration with comprehensive documentation",
                  "CI/CD pipeline compatibility for pre-deployment testing",
                  "Custom webhook notifications for your tech stack"
                ],
                bgColor: "bg-[#fef8e0]",
                iconColor: "text-yellow-600",
                index: 4
              },
              {
                icon: <Shield />,
                title: "Legal Compliance",
                description: "Support for global accessibility standards and legal requirements",
                bulletPoints: [
                  "Coverage for WCAG 2.1, Section 508, ADA, and AODA",
                  "Legal compliance documentation and audit trails",
                  "Expert guidance on regional accessibility requirements"
                ],
                bgColor: "bg-[#e5f4ff]",
                iconColor: "text-blue-500",
                index: 5
              }
            ].map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * feature.index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:shadow-lg h-full"
              >
                <div className={`w-14 h-14 ${feature.bgColor} dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-6`}>
                  <div className={`${feature.iconColor} w-6 h-6`}>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Based on cta-banner.tsx from UI Kit */}
      <section className="py-20 bg-gradient-to-r from-[#0fae96] to-[#0d9882] text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to make your website accessible to everyone?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Start your free trial today and see how easy it is to achieve WCAG compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <form onSubmit={handleTrialSignup}>
                <button 
                  type="submit" 
                  disabled={isTrialSubmitting}
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#0fae96] font-medium transition-all duration-300 rounded-full px-8 py-4"
                >
                  {isTrialSubmitting ? "Starting..." : "Start Free Trial"} <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>
              </form>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 border border-white hover:bg-white/10 rounded-full text-white font-medium"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Based on newsletter-section.tsx from UI Kit */}
      <section className="py-24 bg-[#f9fdff] dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Stay Updated with Accessibility News</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
              Get the latest updates, tips, and industry news on web accessibility.
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3 mb-6 max-w-lg mx-auto">
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                required
                className="flex-grow px-5 py-4 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              />
              <button 
                type="submit"
                disabled={isNewsletterSubmitting}
                className="bg-[#0fae96] hover:bg-[#0fae96]/90 text-white rounded-full px-8 py-4 font-medium"
              >
                {isNewsletterSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Back to regular pages link */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Preview Mode</div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-sm text-gray-700 dark:text-gray-300"
            >
              Return to Current Home
            </Link>
            <Link
              to="/preview/ui-kit"
              className="px-3 py-1 bg-[#0fae96] hover:bg-[#0fae96]/90 rounded text-sm text-white"
            >
              UI Kit Preview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHomePage;