import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/** Playground SPA. */
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves at /<repo>/; keep `/` for local `npm run dev`.
  base: process.env.GITHUB_ACTIONS === 'true' ? '/Pixel-Status/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
  },
});
