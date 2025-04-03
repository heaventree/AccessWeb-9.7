import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { PricingPage } from './pages/PricingPage';
import { SubscriptionDashboard } from './pages/SubscriptionDashboard';
import { PaymentPage } from './pages/PaymentPage';
import { IntegrationsPage } from './pages/integrations/IntegrationsPage';
import { AuthPage } from './pages/AuthPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPackages } from './pages/admin/AdminPackages';
import { AdminClients } from './pages/admin/AdminClients';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminPaymentGateways } from './pages/admin/AdminPaymentGateways';
import { AdminCMS } from './pages/admin/AdminCMS';
import { AdminRoadmap } from './pages/admin/AdminRoadmap';
import { AdminDebug } from './pages/admin/AdminDebug';
import { IntegrationsOverview } from './pages/integrations/IntegrationsOverview';
import { ConnectionsPage } from './pages/connections/ConnectionsPage';
import { CustomAPIPage } from './pages/connections/CustomAPIPage';
import { ShopifyAPIPage } from './pages/connections/ShopifyAPIPage';
import { WordPressAPIPage } from './pages/connections/WordPressAPIPage';
import { APIGuide } from './pages/docs/APIGuide';
import { WordPressGuide } from './pages/docs/WordPressGuide';
import { ShopifyGuide } from './pages/docs/ShopifyGuide';
import { DocumentationPage } from './pages/docs/DocumentationPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { WCAGCheckerPage } from './pages/WCAGCheckerPage';
import { WCAGStandardsTable } from './pages/WCAGStandardsTable';
import WCAGColorPalette from './pages/tools/WCAGColorPalette';
import { WordPressDashboard } from './components/integrations/WordPressDashboard';
import { CustomAPISetup } from './components/integrations/CustomAPISetup';
import { MonitoringDashboard } from './components/MonitoringDashboard';
import { RealTimeMonitor } from './components/RealTimeMonitor';
import { ShopifyAppSetup } from './components/integrations/ShopifyAppSetup';
import { ShopifyDashboard } from './components/integrations/ShopifyDashboard';
import { BlogPage } from './pages/BlogPage';
import { ArticlePage } from './pages/ArticlePage';
import { WcagResourcesPage } from './pages/WcagResourcesPage';
import { NonDestructiveFixPage } from './pages/NonDestructiveFixPage';
import { BackToTop } from './components/BackToTop';
import { Toaster } from 'react-hot-toast';
import { ScrollToTop } from './components/ScrollToTop';
import { MonitoringPage } from './pages/MonitoringPage';
import { RealTimeMonitorPage } from './pages/RealTimeMonitorPage';
import { WordPressIntegrationPage } from './pages/WordPressIntegrationPage';
import { WordPressIntPage } from './pages/WordPressIntPage';
import { APIIntegrationPage } from './pages/integrations/APIIntegrationPage';
import { ComplianceIntegrationPage } from './pages/integrations/ComplianceIntegrationPage';
import { ShopifyIntegrationPage } from './pages/integrations/ShopifyIntegrationPage';
import { BillingPage } from './pages/BillingPage';
import { EnterpriseIntegrationPage } from './pages/integrations/EnterpriseIntegrationPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { CompliancePage } from './pages/compliance/CompliancePage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { TeamPage } from './pages/team/TeamPage';
import { HelpCenter } from './pages/HelpCenter';
import { HelpArticle } from './pages/HelpArticle';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';

import { ErrorPage } from './components/ErrorPage';

function App() {
  return (
    <AppProvider>
      <ErrorBoundary>
        <Router>
          <ScrollToTop />
          <Toaster position="top-center" />
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <a href="#main-content" className="skip-to-main">Skip to main content</a>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<><Navigation /><main id="main-content"><LandingPage /></main><Footer /><BackToTop /></>} />
              <Route path="/pricing" element={<><Navigation /><main id="main-content"><PricingPage /></main><Footer /><BackToTop /></>} />
              <Route path="/wordpressint" element={<><Navigation /><main id="main-content"><WordPressIntPage /></main><Footer /><BackToTop /></>} />
              <Route path="/checker" element={<><Navigation /><main id="main-content"><WCAGCheckerPage /></main><Footer /><BackToTop /></>} />
              <Route path="/tools/wcag-standards" element={<><Navigation /><main id="main-content"><WCAGStandardsTable /></main><Footer /><BackToTop /></>} />
              <Route path="/tools/colors" element={<><Navigation /><main id="main-content"><WCAGColorPalette /></main><Footer /><BackToTop /></>} />
              <Route path="/tools/monitoring" element={<><Navigation /><main id="main-content"><MonitoringPage /></main><Footer /><BackToTop /></>} />
              <Route path="/tools/realtime" element={<><Navigation /><main id="main-content"><RealTimeMonitorPage /></main><Footer /><BackToTop /></>} />
              <Route path="/my-account/connections" element={<ProtectedRoute><ConnectionsPage /></ProtectedRoute>} />
              <Route path="/my-account/connections/custom-api" element={<ProtectedRoute><CustomAPIPage /></ProtectedRoute>} />
              <Route path="/my-account/connections/shopify" element={<ProtectedRoute><ShopifyAPIPage /></ProtectedRoute>} />
              <Route path="/my-account/connections/wordpress" element={<ProtectedRoute><WordPressAPIPage /></ProtectedRoute>} />
              <Route path="/integrations/wordpress" element={<><Navigation /><main id="main-content"><WordPressIntPage /></main><Footer /><BackToTop /></>} />
              <Route path="/tools/analytics" element={<><Navigation /><main id="main-content"><AnalyticsPage /></main><Footer /><BackToTop /></>} />
              <Route path="/tools/compliance" element={<><Navigation /><main id="main-content"><CompliancePage /></main><Footer /><BackToTop /></>} />
              <Route path="/integrations/api" element={<><Navigation /><main id="main-content"><APIIntegrationPage /></main><Footer /><BackToTop /></>} />
              <Route path="/integrations/compliance" element={<><Navigation /><main id="main-content"><ComplianceIntegrationPage /></main><Footer /><BackToTop /></>} />
              <Route path="/integrations/enterprise" element={<><Navigation /><main id="main-content"><EnterpriseIntegrationPage /></main><Footer /><BackToTop /></>} />
              <Route path="/docs" element={<><Navigation /><main id="main-content"><DocumentationPage /></main><Footer /><BackToTop /></>} />
              <Route path="/docs/api" element={<><Navigation /><main id="main-content"><APIGuide /></main><Footer /><BackToTop /></>} />
              <Route path="/docs/wordpress" element={<><Navigation /><main id="main-content"><WordPressGuide /></main><Footer /><BackToTop /></>} />
              <Route path="/docs/shopify" element={<><Navigation /><main id="main-content"><ShopifyGuide /></main><Footer /><BackToTop /></>} />
              <Route path="/knowledge-base" element={<><Navigation /><main id="main-content"><KnowledgeBasePage /></main><Footer /><BackToTop /></>} />
              <Route path="/blog" element={<><Navigation /><main id="main-content"><BlogPage /></main><Footer /><BackToTop /></>} />
              <Route path="/blog/:slug" element={<><Navigation /><main id="main-content"><ArticlePage /></main><Footer /><BackToTop /></>} />
              <Route path="/wcag-resources" element={<><Navigation /><main id="main-content"><WcagResourcesPage /></main><Footer /><BackToTop /></>} />
              <Route path="/non-destructive-fixes" element={<><Navigation /><main id="main-content"><NonDestructiveFixPage /></main><Footer /><BackToTop /></>} />
              <Route path="/help" element={<><Navigation /><main id="main-content"><HelpCenter /></main><Footer /><BackToTop /></>} />
              <Route path="/help/:slug" element={<><Navigation /><main id="main-content"><HelpArticle /></main><Footer /><BackToTop /></>} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/signup" element={<AuthPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><><Navigation /><main id="main-content"><SubscriptionDashboard /></main><Footer /><BackToTop /></></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><><Navigation /><main id="main-content"><BillingPage /></main><Footer /><BackToTop /></></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><><Navigation /><main id="main-content"><SettingsPage /></main><Footer /><BackToTop /></></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute><><Navigation /><main id="main-content"><TeamPage /></main><Footer /><BackToTop /></></ProtectedRoute>} />
              <Route path="/integrations/shopify" element={<ProtectedRoute><><Navigation /><main id="main-content"><ShopifyIntegrationPage /></main><Footer /><BackToTop /></></ProtectedRoute>} />
              <Route path="/payment/:planId" element={<ProtectedRoute><><Navigation /><main id="main-content"><PaymentPage /></main><Footer /><BackToTop /></></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="packages" element={<AdminPackages />} />
                <Route path="clients" element={<AdminClients />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="payment-gateways" element={<AdminPaymentGateways />} />
                <Route path="cms/*" element={<AdminCMS />} />
                <Route path="roadmap" element={<AdminRoadmap />} />
                <Route path="debug" element={<AdminDebug />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={
                <ErrorPage
                  title="Page Not Found"
                  message="The page you're looking for doesn't exist. Please check the URL or navigate back to the homepage."
                />
              } />
            </Routes>
            <AccessibilityToolbar />
          </div>
        </Router>
      </ErrorBoundary>
    </AppProvider>
  );
}

export default App;