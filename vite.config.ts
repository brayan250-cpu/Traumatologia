import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core':   ['react', 'react-dom'],
          'three-core':   ['three'],
          'three-fiber':  ['@react-three/fiber', '@react-three/drei'],
          'gsap-core':    ['gsap'],
          'lenis':        ['lenis'],
          'supabase':     ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});

