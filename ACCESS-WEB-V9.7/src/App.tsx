import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import StrapiLayout from '@/layouts/StrapiLayout';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import DynamicPageRenderer from '@/pages/DynamicPageRenderer';

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
          {/* Main routes with standard layout */}
          <Route element={<StrapiLayout />}>
            <Route path="/" element={<HomePage />} />
            
            {/* Specific dynamic page routes */}
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