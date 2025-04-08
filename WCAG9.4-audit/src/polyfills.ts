/**
 * Browser environment polyfills
 * 
 * These polyfills are required to use Node.js modules like util and stream in the browser.
 */

// Define process before anything else - this is a crucial polyfill for many Node.js modules
(window as any).process = (window as any).process || {
  env: {
    NODE_ENV: import.meta.env.MODE || 'development'
  },
  nextTick: function(fn: Function, ...args: any[]) {
    setTimeout(() => fn(...args), 0);
  },
  browser: true,
  cwd: () => '/',
  version: '',
  versions: {},
  platform: 'browser'
};

// Buffer for binary data manipulation
import { Buffer } from 'buffer';
(window as any).Buffer = (window as any).Buffer || Buffer;

// Utility module polyfill
import * as util from 'util';
(window as any).util = util;

// Stream for data streaming
import * as stream from 'stream-browserify';
(window as any).stream = stream;

export {};