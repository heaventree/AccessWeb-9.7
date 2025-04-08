import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Add Node.js polyfills
      'process': 'process/browser',
      'stream': 'stream-browserify',
      'util': 'util',
    },
  },
  define: {
    // Define global process variable
    'process.env': process.env,
    'global': {},
  },
});