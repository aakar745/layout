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
    include: ['@ant-design/icons', 'lodash', 'dayjs']
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
        // Better code splitting 
        manualChunks: {
          // Split vendor chunks
          'vendor-antd': ['antd'],
          'vendor-antd-icons': ['@ant-design/icons'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['react-redux', '@reduxjs/toolkit'],
          'vendor-pdf': ['@react-pdf/renderer', 'react-pdf'],
          'vendor-ui': ['@emotion/react', '@emotion/styled', 'classnames'],
          'vendor-http': ['axios'],
          'vendor-date': ['dayjs'],
          'vendor-utils': ['lodash', 'jwt-decode'],
          'vendor-canvas': ['konva', 'react-konva', 'use-image'],
          'vendor-editor': ['@tinymce/tinymce-react', 'tinymce'],
        }
      }
    }
  }
}); 