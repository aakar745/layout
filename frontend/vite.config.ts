import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html',
    }),
  ],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@services': path.resolve(__dirname, './src/services'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages')
    }
  },
  // Add custom config for CSS
  css: {
    devSourcemap: true
  },
  // Basic optimization for dependencies
  optimizeDeps: {
    include: ['@ant-design/icons', 'lodash', 'dayjs', 'axios']
  },
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000, // Increase warning limit to reduce noise
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        // Ensure asset file names contain their content hash to improve caching
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Chunk naming pattern for better identification
        chunkFileNames: 'assets/[name]-[hash].js',
        // Main bundle naming
        entryFileNames: 'assets/[name]-[hash].js',
        // Simplified chunking strategy that's less likely to break exhibitor functionality
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit', 'antd', '@ant-design/icons'],
          'apis': ['axios', './src/services/api.ts'],
          'utils': ['lodash', 'dayjs', 'jwt-decode'],
          'canvas': ['konva', 'react-konva', 'use-image'],
          'editor': ['@tinymce/tinymce-react', 'tinymce'],
        }
      }
    }
  }
}); 