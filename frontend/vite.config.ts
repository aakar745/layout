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
    chunkSizeWarningLimit: 800, // Increase limit for large chunks
    rollupOptions: {
      output: {
        // Ensure consistent chunk naming for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // Ensure chunks are compatible with React.lazy dynamic imports
        manualChunks: (id) => {
          // Vendor chunks - more granular to reduce chunk sizes
          if (id.includes('node_modules')) {
            // UI Framework - split Ant Design into smaller chunks
            if (id.includes('@ant-design/icons')) {
              return 'vendor-antd-icons';
            }
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'vendor-antd-core';
            }
            
            // React ecosystem
            if (id.includes('react-dom')) {
              return 'vendor-react-dom';
            }
            if (id.includes('react-router')) {
              return 'vendor-react-router';
            }
            if (id.includes('react-redux') || id.includes('@reduxjs/toolkit')) {
              return 'vendor-redux';
            }
            if (id.includes('react') && !id.includes('react-konva')) {
              return 'vendor-react-core';
            }
            
            // Canvas/layout related
            if (id.includes('konva') || id.includes('use-image')) {
              return 'vendor-canvas';
            }
            
            // PDF rendering
            if (id.includes('pdf')) {
              return 'vendor-pdf';
            }
            
            // Editor components
            if (id.includes('tinymce')) {
              return 'vendor-editor';
            }
            
            // Common utilities
            if (id.includes('lodash') || id.includes('dayjs') || id.includes('moment')) {
              return 'vendor-date-utils';
            }
            if (id.includes('axios') || id.includes('jwt')) {
              return 'vendor-http';
            }
            
            // Other UI utilities
            if (id.includes('@emotion') || id.includes('classnames')) {
              return 'vendor-ui-utils';
            }
            
            // Excel/CSV processing
            if (id.includes('xlsx') || id.includes('file-saver')) {
              return 'vendor-export';
            }
            
            // Group remaining dependencies
            return 'vendor-deps';
          }
          
          // Application code chunks - group by feature areas
          // This approach doesn't use dynamic imports but still splits the app logically
          
          // Core/layouts/common components
          if (id.includes('/src/layouts') || id.includes('/src/components/common') || 
              id.includes('/src/components/layout') || id.includes('/src/services')) {
            return 'app-core';
          }
          
          // Authentication related
          if (id.includes('/src/pages/auth') || id.includes('/auth') || 
              id.includes('/src/store/slices/authSlice')) {
            return 'app-auth';
          }
          
          // Exhibition management
          if (id.includes('/src/pages/exhibition') || id.includes('/src/store/slices/exhibitionSlice') || 
              id.includes('/src/components/exhibition')) {
            return 'app-exhibition';
          }
          
          // Stall management
          if (id.includes('/src/pages/stall') || id.includes('/stall/') || 
              id.includes('/src/store/slices/stallSlice')) {
            return 'app-stall';
          }
          
          // Booking management
          if (id.includes('/src/pages/booking') || id.includes('/booking/') || 
              id.includes('/src/store/slices/bookingSlice')) {
            return 'app-booking';
          }
          
          // Exhibitor portal
          if (id.includes('/src/pages/exhibitor') || id.includes('/exhibitor/') || 
              id.includes('/src/store/slices/exhibitorSlice')) {
            return 'app-exhibitor';
          }
          
          // Invoice/Financial management
          if (id.includes('/src/pages/invoice') || id.includes('/invoice/') || 
              id.includes('/src/store/services/invoice')) {
            return 'app-invoice';
          }
          
          // Settings, users, roles
          if (id.includes('/src/pages/settings') || id.includes('/src/pages/users') || 
              id.includes('/src/pages/roles')) {
            return 'app-admin';
          }
          
          // Dashboard and reports
          if (id.includes('/src/pages/dashboard') || id.includes('/dashboard/')) {
            return 'app-dashboard';
          }
        }
      }
    }
  }
}); 