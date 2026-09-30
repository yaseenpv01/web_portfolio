import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        inaxus: resolve(import.meta.dirname, 'projects/inaxus/index.html'),
        fgic: resolve(import.meta.dirname, 'projects/fgic-attendance/index.html'),
        localAI: resolve(import.meta.dirname, 'projects/local-ai-document-parser/index.html'),
      },
    },
  },
});
