import { resolve } from 'node:path';
import { defineConfig } from 'vite';

/** Library — ESM + IIFE bundles. */
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PixelStatus',
      formats: ['es', 'iife'],
      fileName: (format) =>
        format === 'iife' ? 'pixel-status.min.js' : 'pixel-status.esm.js',
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        passes: 2,
        drop_console: true,
        drop_debugger: true,
      },
      format: { comments: false },
    },
    target: 'es2020',
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: { compact: true },
    },
  },
});
