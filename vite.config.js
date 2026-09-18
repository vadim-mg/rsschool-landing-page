import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    cssMinify: false
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        sourceMap: true
      }
    }
  },
  server: {
    port: 5173,
    open: true,
  },
});