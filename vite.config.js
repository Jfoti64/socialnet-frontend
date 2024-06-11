import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    coverage: {
      provider: 'v8', // or 'c8'
      reporter: ['text', 'html'], // 'text' for console output, 'html' for HTML report
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
});
