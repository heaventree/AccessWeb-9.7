import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  BarChart, 
  CheckCircle, 
  ArrowRight,
  Code,
  Globe,
  Clock
} from 'lucide-react';

// Import UI components
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-12 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Transform WCAG Guidelines Into 
              <span className="text-[#0fae96] dark:text-[#5eead4]"> Accessible Experiences</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Comprehensive tools and resources to help you build accessible websites
              that comply with modern standards and reach all your users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-8 py-3 rounded-full text-lg font-medium inline-flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
              </Button>
              <Button 
                onClick={() => navigate('/demo')}
                variant="outline"
                className="bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 px-8 py-3 rounded-full text-lg font-medium"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">99%</p>
                <p className="text-gray-600 dark:text-gray-400">Accuracy Rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">5M+</p>
                <p className="text-gray-600 dark:text-gray-400">Pages Scanned</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">10k+</p>
                <p className="text-gray-600 dark:text-gray-400">Happy Customers</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-[#0fae96] dark:text-[#5eead4] mb-2">24/7</p>
                <p className="text-gray-600 dark:text-gray-400">Expert Support</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Powerful Accessibility Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
                  <Shield className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Automated Testing</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Scan your entire website automatically for WCAG 2.1 compliance issues
                  and get detailed reports with actionable fixes.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
                  <Zap className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Fixes</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get instant recommendations and code snippets to fix accessibility issues
                  right when you need them.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
                  <BarChart className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Detailed Reports</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate comprehensive reports for stakeholders and compliance records
                  that track your progress over time.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 4 */}
            <Card className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
                  <Globe className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Global Standards</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Support for WCAG 2.1, Section 508, ADA, and international standards
                  so you're covered everywhere.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 5 */}
            <Card className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
                  <Code className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">API Access</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Integrate accessibility testing into your development workflow
                  with our easy-to-use API.
                </p>
              </CardContent>
            </Card>

            {/* Feature Card 6 */}
            <Card className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardContent className="p-6">
                <div className="rounded-full bg-[#0fae96]/10 dark:bg-[#0fae96]/20 p-3 inline-block mb-4">
                  <Clock className="h-6 w-6 text-[#0fae96] dark:text-[#5eead4]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">24/7 Monitoring</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Continuous monitoring to catch accessibility issues before users do,
                  keeping your site compliant all the time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0fae96]/5 dark:bg-[#0fae96]/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              Ready to make your website accessible to everyone?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Join thousands of organizations that trust AccessWeb to ensure their
              digital presence is accessible to all users.
            </p>
            <div className="flex justify-center">
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-[#0066FF] hover:bg-[#0066FF]/90 text-white px-8 py-3 rounded-full text-lg font-medium"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Trusted by Industry Leaders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Sarah Wilson"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Sarah Wilson</h4>
                  <p className="text-gray-500 dark:text-gray-400">Head of Digital, TechCorp</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                "AccessWeb has transformed how we approach accessibility. The automated testing and real-time monitoring have saved us countless hours."
              </p>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Michael Chen"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Michael Chen</h4>
                  <p className="text-gray-500 dark:text-gray-400">CTO, WebSolutions</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                "The detailed reports and fix suggestions make it easy for our developers to maintain WCAG compliance across all our projects."
              </p>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="David Thompson"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">David Thompson</h4>
                  <p className="text-gray-500 dark:text-gray-400">Accessibility Lead, Agency X</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                "AccessWeb's continuous monitoring gives us peace of mind knowing our sites stay compliant even as we make updates."
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}