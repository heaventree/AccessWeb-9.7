import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  BarChart, 
  Activity,
  CheckCircle, 
  ArrowRight,
  Code,
  Globe,
  Award,
  Clock,
  PlayCircle,
  Check,
  RefreshCw,
  Users,
  Star,
  Building
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const [isTrialSubmitting, setIsTrialSubmitting] = useState(false);
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  
  // Function to handle free trial signup
  const handleTrialSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsTrialSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsTrialSubmitting(false);
      navigate('/signup');
    }, 800);
  };

  // Function to handle newsletter signup
  const handleNewsletterSignup = async (e: FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsNewsletterSubmitting(false);
      // Show success notification (could use toast here)
      alert('Thank you for subscribing to our newsletter!');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section - Updated with new design */}
      <section className="pt-28 pb-16 md:pb-32 bg-gradient-to-b from-[#f9fdff] to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="inline-block px-4 py-1.5 bg-[#e0f5f1] text-[#0fae96] dark:bg-[#0fae96]/20 dark:text-[#5eead4] rounded-full font-medium text-sm mb-6">
                Introducing the industry standard for WCAG compliance
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 text-transparent bg-clip-text">
                Make Your Website Accessible to <span className="text-primary dark:text-[#5eead4]">Everyone</span>
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                Automated WCAG compliance testing and monitoring to ensure your website is accessible to all users. Get detailed reports and fixes in minutes.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <form onSubmit={handleTrialSignup} className="flex-shrink-0">
                  <button 
                    type="submit" 
                    disabled={isTrialSubmitting}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80 transition-all duration-300 rounded-full px-8 py-3 text-white font-medium"
                  >
                    {isTrialSubmitting ? "Starting..." : "Start Free Trial"} <ArrowRight className="ml-2 h-5 w-5 inline" />
                  </button>
                </form>
                
                <button 
                  onClick={() => navigate('/demo')}
                  className="border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-colors rounded-full px-8 py-3 border font-medium"
                >
                  <PlayCircle className="mr-2 h-5 w-5 text-primary dark:text-primary inline" />
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
      <section className="py-8 bg-background dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-1">10M+</p>
              <p className="text-gray-600 dark:text-gray-400">Pages Scanned</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-1">97%</p>
              <p className="text-gray-600 dark:text-gray-400">Detection Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-1">15k+</p>
              <p className="text-gray-600 dark:text-gray-400">Happy Customers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary dark:text-primary mb-1">60%</p>
              <p className="text-gray-600 dark:text-gray-400">Time Saved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Everything You Need For WCAG Compliance</h2>
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
                iconColor: "text-primary",
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
                iconColor: "text-primary",
                index: 1
              },
              {
                icon: <BarChart />,
                title: "Detailed Reports",
                description: "Generate comprehensive reports for stakeholders and compliance records",
                bulletPoints: [
                  "WCAG criteria breakdown with severity indicators",
                  "Exportable compliance documents in multiple formats",
                  "Progress tracking dashboard with historical data"
                ],
                bgColor: "bg-[#eeeaff]",
                iconColor: "text-primary",
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
                iconColor: "text-primary",
                index: 3
              },
              {
                icon: <Code />,
                title: "Developer Tools",
                description: "Integrate accessibility testing into your development workflow",
                bulletPoints: [
                  "RESTful API integration with comprehensive documentation",
                  "CI/CD pipeline compatibility for pre-deployment testing",
                  "Custom webhook notifications for your tech stack"
                ],
                bgColor: "bg-[#fef8e0]",
                iconColor: "text-primary",
                index: 4
              },
              {
                icon: <Globe />,
                title: "Legal Compliance",
                description: "Support for global accessibility standards and legal requirements",
                bulletPoints: [
                  "Coverage for WCAG 2.1, Section 508, ADA, and AODA",
                  "Legal compliance documentation and audit trails",
                  "Expert guidance on regional accessibility requirements"
                ],
                bgColor: "bg-[#e5f4ff]",
                iconColor: "text-primary",
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
                  <div className={`${feature.iconColor} dark:text-primary w-6 h-6`}>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="w-5 h-5 mr-3 text-primary dark:text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 dark:text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#f9fdff] dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">How AccessWeb Works</h2>
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
                icon: <Code />,
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
                  <div className="mb-4 text-5xl font-bold text-primary/20 dark:text-primary/20">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
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
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-primary font-medium transition-all duration-300 rounded-full px-8 py-3"
                >
                  {isTrialSubmitting ? "Starting..." : "Start Free Trial"} <ArrowRight className="ml-2 h-5 w-5 inline" />
                </button>
              </form>
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center justify-center px-8 py-3 border border-white hover:bg-white/10 rounded-full text-white font-medium"
              >
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Trusted by Industry Leaders</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See what our customers are saying about our accessibility platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "AccessWeb has completely transformed how we approach web accessibility. The automated tools saved our team countless hours.",
                author: "Sarah Wilson",
                position: "CTO, TechCorp",
                avatar: <Users className="w-12 h-12 text-primary bg-[#e0f5f1] dark:bg-primary/20 p-2 rounded-full" />,
                index: 0
              },
              {
                quote: "The detailed reports and fix suggestions make it easy for our developers to maintain WCAG compliance across all our projects.",
                author: "Michael Chen",
                position: "Web Director, AgencyX",
                avatar: <Building className="w-12 h-12 text-primary bg-[#e0f5f1] dark:bg-primary/20 p-2 rounded-full" />,
                index: 1
              },
              {
                quote: "As an accessibility specialist, I'm impressed by the accuracy and depth of the automated tests. It catches issues I would have missed.",
                author: "David Thompson",
                position: "Accessibility Lead, WebFirst",
                avatar: <Star className="w-12 h-12 text-primary bg-[#e0f5f1] dark:bg-primary/20 p-2 rounded-full" />,
                index: 2
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * testimonial.index }}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="mb-6">
                  {testimonial.avatar}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">"{testimonial.quote}"</p>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.author}</h4>
                  <p className="text-gray-500 dark:text-gray-400">{testimonial.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-[#f9fdff] dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Stay Updated</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Subscribe to our newsletter for the latest accessibility tips, tools, and regulatory updates.
            </p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                required
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={isNewsletterSubmitting}
                className="bg-primary hover:bg-primary/90 text-white font-medium transition-all duration-300 rounded-lg px-6 py-3"
              >
                {isNewsletterSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}