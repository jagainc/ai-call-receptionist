import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Use the React plugin for Vite
  server: {
    port: 3000, // The port where your React frontend will run in development
    proxy: {
      // Proxy API requests from /api to your Spring Boot backend
      '/api': {
        target: 'http://localhost:8080', // Target URL of your Spring Boot backend
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove the /api prefix when forwarding
      },
      // Proxy WebSocket connections from /ws to your Spring Boot backend
      '/ws': {
        target: 'ws://localhost:8080', // Target WebSocket URL of your Spring Boot backend
        ws: true, // Enable WebSocket proxying
        changeOrigin: true, // Needed for WebSocket proxy
      },
    },
    // To allow access from other devices on your local network during development
    // host: true, // Uncomment this if you need to access from other devices (e.g., mobile)
  },
  build: {
    // Output directory for the production build
    outDir: 'dist',
    // Generate sourcemaps for easier debugging in production
    sourcemap: true,
  },
  // Configure how static assets are handled
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.ico'],
});
