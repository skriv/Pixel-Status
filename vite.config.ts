import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** Playground SPA. */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
  },
});
