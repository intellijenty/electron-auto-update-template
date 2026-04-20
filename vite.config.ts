import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  server: {
    port: 5274,
    strictPort: true,
  },
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
