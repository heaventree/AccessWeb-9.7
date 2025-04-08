import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Buffer } from 'buffer';
import * as util from 'util';
import * as stream from 'stream-browserify';
import App from './App';
import './index.css';
import { AppProvider } from './providers/AppProvider';

// Fix for polyfills in browser environment
window.Buffer = window.Buffer || Buffer;

// Define process in the browser environment
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.process = {
    env: {
      NODE_ENV: import.meta.env.MODE || 'development'
    }
  };
  
  // Fix for util polyfill
  // @ts-ignore
  window.util = util;
  // @ts-ignore
  window.stream = stream;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);