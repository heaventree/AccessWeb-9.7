import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import StrapiLayout from '@/layouts/StrapiLayout';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import DynamicPageRenderer from '@/pages/DynamicPageRenderer';

// Admin pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import ContentManagerPage from '@/pages/admin/ContentManagerPage';
import PageEditorPage from '@/pages/admin/PageEditorPage';
import PagePreviewPage from '@/pages/admin/PagePreviewPage';

// We'll import the existing pages as needed
// For example, if the app has tools/WCAGColorPalettePage, you'd import it here

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
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboardPage />}>
            <Route path="content" element={<ContentManagerPage />} />
            <Route path="content/create" element={<PageEditorPage />} />
            <Route path="content/edit/:id" element={<PageEditorPage />} />
            <Route path="content/preview/:id" element={<PagePreviewPage />} />
            {/* Add more admin routes as needed */}
          </Route>
          
          {/* Main routes with standard layout */}
          <Route element={<StrapiLayout />}>
            <Route path="/" element={<HomePage />} />
            
            {/* Here you would add all your existing routes */}
            {/* For example:
            <Route path="/tools/colour-palette" element={<WCAGColorPalettePage />} />
            <Route path="/tools/image-alt-scanner" element={<ImageAltScannerPage />} />
            <Route path="/my-account" element={<MyAccountPage />} />
            */}
            
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