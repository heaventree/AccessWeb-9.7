import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import StrapiLayout from '@/layouts/StrapiLayout';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import DynamicPageRenderer from '@/pages/DynamicPageRenderer';

// Admin pages for the new CMS functionality
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import ContentManagerPage from '@/pages/admin/ContentManagerPage';
import PageEditorPage from '@/pages/admin/PageEditorPage';
import PagePreviewPage from '@/pages/admin/PagePreviewPage';

// Simple account page component
const SimpleAccountPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Account</h1>
    <p className="text-gray-700 dark:text-gray-300">This is a simple account page. More functionality will be added soon.</p>
  </div>
);

// Simple tool page wrappers
const ColorPalettePage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">WCAG Colour Palette Tool</h1>
    <p className="text-gray-700 dark:text-gray-300">The WCAG Colour Palette Tool helps you create and test accessible color combinations.</p>
  </div>
);

const ImageAltScannerPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Image Alt Scanner Tool</h1>
    <p className="text-gray-700 dark:text-gray-300">The Image Alt Scanner helps you identify and fix missing alt text for better accessibility.</p>
  </div>
);

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Helmet defaultTitle="AccessWeb | Web Accessibility Platform" titleTemplate="%s | AccessWeb">
        <meta name="description" content="Create inclusive digital experiences through intelligent accessibility compliance tools" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0fae96" />
      </Helmet>
      
      <BrowserRouter>
        <Routes>
          {/* Admin routes for the CMS */}
          <Route path="/admin" element={<AdminDashboardPage />}>
            <Route path="content" element={<ContentManagerPage />} />
            <Route path="content/create" element={<PageEditorPage />} />
            <Route path="content/edit/:id" element={<PageEditorPage />} />
            <Route path="content/preview/:id" element={<PagePreviewPage />} />
          </Route>
          
          {/* Main routes with standard layout */}
          <Route element={<StrapiLayout />}>
            {/* Homepage */}
            <Route path="/" element={<HomePage />} />
            
            {/* Tool pages */}
            <Route path="/tools/colour-palette" element={<ColorPalettePage />} />
            <Route path="/tools/image-alt-scanner" element={<ImageAltScannerPage />} />
            
            {/* Account page */}
            <Route path="/my-account" element={<SimpleAccountPage />} />
            
            {/* Catch-all route for dynamic Strapi pages */}
            <Route path="/:slug" element={<DynamicPageRenderer />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
};

export default App;