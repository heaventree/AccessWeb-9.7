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
      // Node.js polyfills
      'process': resolve(__dirname, 'src/polyfills/process.js'),
      'util': 'util',
      'stream': 'stream-browserify',
      'buffer': 'buffer',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  define: {
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    },
    'global': 'window',
  },
});