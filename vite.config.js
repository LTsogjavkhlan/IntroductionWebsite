import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync } from 'fs';
import { tmpdir } from 'os';
import 'dotenv/config';

const apiPort = process.env.PORT || 3001;

export default defineConfig({
  cacheDir: resolve(tmpdir(), 'mindora-vite-cache'),
  server: {
    proxy: {
      '/api': `http://localhost:${apiPort}`,
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        surgalt: resolve(__dirname, 'surgalt.html'),
        zuwluguu: resolve(__dirname, 'zuwluguu.html'),
        td: resolve(__dirname, 'TD.html'),
        admin: resolve(__dirname, 'admin.html'),
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
