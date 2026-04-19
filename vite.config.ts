import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      // Proxy /api to the local Express server during development.
      // On Vercel this is handled automatically by the /api serverless functions folder.
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-motion': ['motion/react'],
            'vendor-supabase': ['@supabase/supabase-js'],
            'vendor-lucide': ['lucide-react'],
          },
        },
      },
    },
    // Serve index.html for all routes (SPA fallback)
    appType: 'spa' as const,
  };
});
