import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // automatically opens in browser
    open: true,
    port: 8000,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Fixes The legacy JS API is deprecated error when updated Sass package as "will be removed in Dart Sass 2.0.0"
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern",
        // Silence issue
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  base: process.env.GH_PAGES === 'true' ? '/mission-control/' : '/',
});
