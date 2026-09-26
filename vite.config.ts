import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  const rootDir = import.meta.dirname || __dirname;
  return {
    root: path.resolve(rootDir, 'client'),
    plugins: [vue(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, 'client/src'),
        '@shared': path.resolve(rootDir, 'shared'),
      },
    },
    build: {
      outDir: path.resolve(rootDir, 'dist'),
      emptyOutDir: true,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
