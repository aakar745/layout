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
  // Optimize dependencies
  optimizeDeps: {
    include: [
      '@ant-design/icons',
      'antd',
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'dayjs',
      'lodash',
      '@reduxjs/toolkit'
    ]
  },
  build: {
    sourcemap: false,
    minify: 'terser', // Use Terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true
      }
    },
    chunkSizeWarningLimit: 800, // Increase warning limit
    rollupOptions: {
      output: {
        // Improve code splitting
        manualChunks: (id) => {
          // Split node_modules into chunks
          if (id.includes('node_modules')) {
            // Create more granular antd chunks to reduce size
            if (id.includes('antd/')) {
              if (id.includes('antd/es/table')) return 'vendor-antd-table';
              if (id.includes('antd/es/form')) return 'vendor-antd-form';
              if (id.includes('antd/es/modal')) return 'vendor-antd-modal';
              if (id.includes('antd/es/button')) return 'vendor-antd-buttons';
              if (id.includes('@ant-design/icons')) return 'vendor-antd-icons';
              return 'vendor-antd-core';
            }
            
            // React ecosystem
            if (id.includes('react-dom') || 
                id.includes('react-router') || 
                id.includes('react-redux')) {
              return 'vendor-react';
            }
            
            if (id.includes('react-konva') || 
                id.includes('konva') || 
                id.includes('use-image')) {
              return 'vendor-canvas';
            }
            
            // PDF related
            if (id.includes('pdf')) return 'vendor-pdf';
            
            // UI libraries
            if (id.includes('emotion') || 
                id.includes('classnames')) {
              return 'vendor-ui';
            }
            
            // Common utilities
            if (id.includes('lodash') || 
                id.includes('dayjs') || 
                id.includes('axios') || 
                id.includes('jwt-decode')) {
              return 'vendor-utils';
            }
            
            // Editor
            if (id.includes('tinymce')) return 'vendor-editor';
            
            // Other common node_modules 
            return 'vendor-others';
          }
          
          // Split application code by top-level directories
          if (id.includes('/src/pages/')) {
            const page = id.split('/src/pages/')[1].split('/')[0];
            return `page-${page}`;
          }
          
          if (id.includes('/src/components/')) {
            const component = id.split('/src/components/')[1].split('/')[0];
            return `component-${component}`;
          }
          
          if (id.includes('/src/services/')) return 'services';
          if (id.includes('/src/store/')) return 'store';
        }
      }
    }
  }
}); 