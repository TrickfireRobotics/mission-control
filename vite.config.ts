import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import { templateCompilerOptions } from '@tresjs/core';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({ ...templateCompilerOptions })],
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
  // Fixes The legacy JS API is deprecated and will be removed in Dart Sass 2.0.0 when updating packages
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
