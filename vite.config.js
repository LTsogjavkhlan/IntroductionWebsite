import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync } from 'fs';
import { tmpdir } from 'os';

export default defineConfig({
  cacheDir: resolve(tmpdir(), 'stepup-vite-cache'),
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        surgalt: resolve(__dirname, 'surgalt.html'),
        zuwluguu: resolve(__dirname, 'zuwluguu.html'),
        td: resolve(__dirname, 'TD.html'),
      },
    },
  },
  plugins: [
    {
      name: 'copy-js',
      closeBundle() {
        cpSync(resolve(__dirname, 'js'), resolve(__dirname, 'dist/js'), { recursive: true });
      },
    },
  ],
});
