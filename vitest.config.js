// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    css: true,
    // IMPORTANT: Exclude backend tests
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/backend/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
    // Only include frontend tests
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
  },
});