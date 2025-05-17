import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
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
    include: ['@ant-design/icons']
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          'vendor-antd': ['antd', '@ant-design/icons'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-redux', '@reduxjs/toolkit'],
          'vendor-pdf': ['@react-pdf/renderer', 'react-pdf'],
          'vendor-ui': ['@emotion/react', '@emotion/styled', 'classnames'],
          'vendor-utils': ['lodash', 'dayjs', 'axios', 'jwt-decode'],
          'vendor-canvas': ['konva', 'react-konva', 'use-image'],
          // Only add tinymce when it's actually imported
          'vendor-editor': ['@tinymce/tinymce-react', 'tinymce'],
        }
      }
    }
  }
}); 