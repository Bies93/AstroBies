import { defineConfig } from 'vite';

export default defineConfig({
  base: '/AstroBies/',
  build: {
    outDir: 'dist',
  },
  server: {
    open: true,
  },
  test: {
    environment: 'happy-dom',
  }
});