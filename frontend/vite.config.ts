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
        manualChunks: {
          // Keep all the React ecosystem together to avoid reference errors
          'vendor-react': [
            'react', 
            'react-dom', 
            'scheduler', 
            'react-is',
            'react-router',
            'react-router-dom',
            'react-redux',
            '@reduxjs/toolkit'
          ],
          // UI libraries
          'vendor-antd': [
            'antd', 
            '@ant-design/icons',
            '@ant-design/colors'
          ],
          // Keep all styling libraries together
          'vendor-styling': [
            '@emotion/react', 
            '@emotion/styled', 
            '@emotion/cache',
            '@emotion/serialize',
            '@emotion/utils',
            '@emotion/hash',
            '@emotion/memoize',
            '@emotion/unitless',
            '@emotion/weak-memoize',
            'classnames',
            'hoist-non-react-statics'
          ],
          // Utilities
          'vendor-utils': [
            'lodash',
            'dayjs',
            'axios',
            'jwt-decode'
          ],
          // File exports
          'vendor-export': [
            'xlsx',
            'file-saver'
          ],
          // Canvas related
          'vendor-canvas': [
            'konva',
            'react-konva',
            'use-image'
          ]
        }
      }
    }
  }
}); 