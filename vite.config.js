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
      exclude: [
        'postcss.config.js',
        'tailwind.config.js',
        'src/main.jsx',
        'src/tests/**',
        'src/setupTests.js',
        'vite.config.js',
      ],
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
});
