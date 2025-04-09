import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Buffer } from 'buffer';
import * as util from 'util';
import * as stream from 'stream-browserify';
import App from './App';

// Import global styles for accessibility features
import './index.css';

// Import theme variables first for proper CSS cascade
import './styles/theme-variables.css';
import './styles/main.css';

// Import module styles
import './styles/modules/animations.css';
import './styles/modules/banner.css';
import './styles/modules/cta.css';
import './styles/modules/features.css';
import './styles/modules/footer.css';
import './styles/modules/header.css';
import './styles/modules/pricing.css';
import './styles/modules/testimonials.css';

// Import other styles
import './styles/accessibility.css';
import './styles/blog.css';
import './styles/custom-sections.css';
import './styles/accessibilityTips.css';

import { AppProvider } from './providers/AppProvider';

// Fix for polyfills in browser environment
window.Buffer = window.Buffer || Buffer;

// Create a minimal process polyfill if it doesn't exist
if (typeof window.process === 'undefined') {
  window.process = { env: {} } as any;
}

// Fix for util polyfill
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.util = util;
  // @ts-ignore
  window.stream = stream;
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <Router>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  </StrictMode>
);