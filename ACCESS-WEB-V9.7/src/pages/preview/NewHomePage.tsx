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
  RefreshCw,
  ChevronDown,
  User,
  Building,
  Star
} from 'lucide-react';

// Preview of new Home Page based on the accepted UI Kit design
const NewHomePage: React.FC = () => {
  const [isTrialSubmitting, setIsTrialSubmitting] = useState(false);
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activePrice, setActivePrice] = useState('monthly');

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

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section - Based on the UI screenshots */}
      <section className="pt-16 pb-16 md:pb-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white">
                Make Your Website Accessible to <span className="text-[#0fae96] dark:text-[#5eead4]">Everyone</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                Automated WCAG compliance testing and monitoring to ensure your website is accessible to all users. Get detailed reports and fixes in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleTrialSignup} className="flex-shrink-0">
                  <button 
                    type="submit" 
                    disabled={isTrialSubmitting}
                    className="w-full sm:w-auto bg-[#0fae96] hover:bg-[#0fae96]/90 dark:bg-[#0fae96] dark:hover:bg-[#0fae96]/80 transition-all duration-300 rounded-full px-8 py-3 text-white font-medium"
                  >
                    {isTrialSubmitting ? "Starting..." : "Start Free Trial"} <ArrowRight className="ml-2 h-5 w-5 inline" />
                  </button>
                </form>
                <button 
                  className="border-gray-300 dark:border-gray-600 hover:border-[#0fae96] dark:hover:border-[#5eead4] transition-colors rounded-full px-8 py-3 border font-medium"
                >
                  <PlayCircle className="mr-2 h-5 w-5 text-[#0fae96] dark:text-[#5eead4] inline" />
                  Watch Demo
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl overflow-hidden"
            >
              <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1573167710701-35950a41e251?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="People working on accessibility improvements"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-1">10M+</p>
              <p className="text-gray-600 dark:text-gray-400">Pages Scanned</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-1">97%</p>
              <p className="text-gray-600 dark:text-gray-400">Detection Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-1">15k+</p>
              <p className="text-gray-600 dark:text-gray-400">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-1">60%</p>
              <p className="text-gray-600 dark:text-gray-400">Time Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Everything You Need For WCAG Compliance</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive accessibility testing and monitoring in one powerful platform
            </p>
          </div>
          
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
                iconColor: "text-[#0fae96]",
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
                iconColor: "text-[#0fae96]",
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
                iconColor: "text-[#0fae96]",
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
                iconColor: "text-[#0fae96]",
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
                <div className={`w-12 h-12 ${feature.bgColor} dark:bg-opacity-20 rounded-xl flex items-center justify-center mb-6`}>
                  <div className={`text-[#0fae96] dark:text-[#5eead4] w-6 h-6`}>{feature.icon}</div>
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

      {/* How AccessibilityWorks Section */}
      <section className="py-16 bg-[#f9fdff] dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">How AccessibilityWorks</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our easy 3-step process to make your website accessible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                number: "01",
                title: "Connect Your Website",
                description: "Simply connect your website using our seamless integration tools that work with any platform.",
                icon: <Code2 />,
                index: 0
              },
              {
                number: "02",
                title: "Automated Analysis",
                description: "Our AI-powered tools scan your entire site for WCAG compliance issues and provide detailed reports.",
                icon: <Activity />,
                index: 1
              },
              {
                number: "03", 
                title: "Implement Fixes",
                description: "Apply our suggested fixes automatically or manually with the help of our developer guidance.",
                icon: <CheckCircle />,
                index: 2
              }
            ].map((step) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * step.index }}
                className="relative"
              >
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full">
                  <div className="mb-4 text-5xl font-bold text-[#0fae96]/20 dark:text-[#5eead4]/20">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3 dark:text-white">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0fae96] to-[#0d9882] text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Start your free trial today and see how easy it is to achieve WCAG compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <form onSubmit={handleTrialSignup}>
                <button 
                  type="submit" 
                  disabled={isTrialSubmitting}
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-[#0fae96] font-medium transition-all duration-300 rounded-full px-8 py-3"
                >
                  {isTrialSubmitting ? "Starting..." : "Start Free Trial"} <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>
              </form>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-8 py-3 border border-white hover:bg-white/10 rounded-full text-white font-medium"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Trusted by Industry Leaders</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See what our customers are saying about our accessibility platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "AccessWebPro has completely transformed how we approach web accessibility. The automated tools saved our team countless hours.",
                author: "Sarah Johnson",
                position: "CTO, TechCorp",
                avatar: <User className="w-12 h-12 text-[#0fae96] bg-[#e0f5f1] dark:bg-[#0fae96]/20 p-2 rounded-full" />,
                index: 0
              },
              {
                quote: "The most comprehensive accessibility solution we've found. The detailed reports make compliance tracking easy for our entire organization.",
                author: "Michael Chen",
                position: "Accessibility Lead, Enterprise Co.",
                avatar: <User className="w-12 h-12 text-[#0fae96] bg-[#e0f5f1] dark:bg-[#0fae96]/20 p-2 rounded-full" />,
                index: 1
              },
              {
                quote: "With AccessWebPro, we were able to identify and fix critical accessibility issues that we had overlooked for years. Incredible tool.",
                author: "Emma Rodriguez",
                position: "Web Director, Global Inc.",
                avatar: <User className="w-12 h-12 text-[#0fae96] bg-[#e0f5f1] dark:bg-[#0fae96]/20 p-2 rounded-full" />,
                index: 2
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * testimonial.index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col"
              >
                <div className="mb-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic mb-8">"{testimonial.quote}"</p>
                </div>
                <div className="mt-auto flex items-center">
                  {testimonial.avatar}
                  <div className="ml-4">
                    <h4 className="font-bold dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.position}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-[#f9fdff] dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your organization's needs
            </p>
            <div className="inline-flex items-center bg-gray-100 dark:bg-gray-700 rounded-full p-1 mt-8">
              <button 
                onClick={() => setActivePrice('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  activePrice === 'monthly' 
                    ? 'bg-[#0fae96] text-white' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setActivePrice('annually')}
                className={`px-6 py-2 rounded-full text-sm font-medium ${
                  activePrice === 'annually' 
                    ? 'bg-[#0fae96] text-white' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Annually
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: activePrice === 'monthly' ? 49 : 39,
                description: "Perfect for small websites and startups.",
                features: [
                  "Up to 5 websites",
                  "500 pages scanned per month",
                  "Weekly automated scans",
                  "Basic reporting dashboard",
                  "Email support"
                ],
                popular: false,
                index: 0
              },
              {
                name: "Professional",
                price: activePrice === 'monthly' ? 99 : 89,
                description: "Ideal for growing businesses and agencies.",
                features: [
                  "Up to 20 websites",
                  "2,000 pages scanned per month",
                  "Daily automated scans",
                  "Advanced reporting & analytics",
                  "API access",
                  "Priority email and chat support",
                  "Compliance documentation"
                ],
                popular: true,
                index: 1
              },
              {
                name: "Enterprise",
                price: activePrice === 'monthly' ? 199 : 179,
                description: "For large organizations with complex needs.",
                features: [
                  "Unlimited websites",
                  "10,000+ pages scanned per month",
                  "Real-time monitoring",
                  "Custom reporting",
                  "Full API access",
                  "Dedicated account manager",
                  "Phone, email and chat support",
                  "Custom integrations"
                ],
                popular: false,
                index: 2
              }
            ].map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * plan.index }}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden ${
                  plan.popular ? 'border-2 border-[#0fae96] ring-2 ring-[#0fae96]/20' : 'border border-gray-100 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 bg-[#0fae96] text-white text-xs font-bold text-center py-1">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-8">
                  <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'mt-4' : ''} dark:text-white`}>{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold dark:text-white">${plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">/ month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 mr-3 text-[#0fae96] dark:text-[#5eead4] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`w-full py-3 rounded-full font-medium ${
                      plan.popular 
                        ? 'bg-[#0fae96] hover:bg-[#0fae96]/90 text-white' 
                        : 'border border-[#0fae96] text-[#0fae96] hover:bg-[#0fae96]/10'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about our accessibility platform
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "Will AccessWebPro work with my existing website?",
                answer: "Yes! AccessWebPro is designed to work with any website regardless of the platform it's built on. Whether you use WordPress, Shopify, custom code, or any other platform, our tools can analyze and help improve your accessibility."
              },
              {
                question: "How accurate is the automated testing?",
                answer: "Our automated testing identifies up to 70% of accessibility issues with 97% accuracy. The remaining issues typically require human judgment, which is why we also provide manual testing services and expert guidance for comprehensive coverage."
              },
              {
                question: "What accessibility standards does AccessWebPro check for?",
                answer: "AccessWebPro tests for compliance with WCAG 2.1 at levels A, AA, and AAA. We also support Section 508, ADA, and international standards like AODA (Canada) and EAA (Europe)."
              },
              {
                question: "Can I export reports for legal documentation?",
                answer: "Absolutely. All plans include the ability to export detailed compliance reports in PDF, CSV, and other formats. These reports are designed to provide comprehensive documentation for legal requirements and can be customized based on your needs."
              },
              {
                question: "Do you provide support for implementing fixes?",
                answer: "Yes. Our platform provides detailed guidance for implementing fixes, including code snippets and step-by-step instructions. Professional and Enterprise plans also include access to our accessibility experts who can provide personalized guidance."
              }
            ].map((faq, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="flex justify-between items-center w-full text-left focus:outline-none"
                >
                  <h3 className="text-lg font-semibold dark:text-white">{faq.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${
                      activeFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`mt-2 transition-all duration-300 overflow-hidden ${
                    activeFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#f9fdff] dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white">Stay Updated on Accessibility</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join our newsletter for the latest updates, tips, and industry news.
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-3 mb-6 max-w-lg mx-auto">
              <input 
                type="email" 
                name="email"
                placeholder="Enter your email" 
                required
                className="flex-grow px-5 py-3 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0fae96]"
              />
              <button 
                type="submit"
                disabled={isNewsletterSubmitting}
                className="bg-[#0fae96] hover:bg-[#0fae96]/90 text-white rounded-full px-6 py-3 font-medium"
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

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 pt-16 pb-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <h3 className="text-xl font-bold mb-4 dark:text-white">AccessWebPro</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-xs">
                Making the web accessible to everyone through intelligent automation and expert guidance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#0fae96] dark:hover:text-[#5eead4]">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.21c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Integrations</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Guides</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 dark:text-white">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4]">Partners</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 AccessWebPro. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4] text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4] text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-[#0fae96] dark:text-gray-400 dark:hover:text-[#5eead4] text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

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