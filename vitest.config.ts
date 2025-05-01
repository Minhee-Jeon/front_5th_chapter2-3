/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/front_5th_chapter2-3/',
  build: {
    outDir: './dist',
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
