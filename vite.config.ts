import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

// GitHub Pages serves this project at https://<user>.github.io/tpakweb/
// so every asset and route has to be prefixed with that folder.
// Override with BASE_PATH=/ when hosting at a domain root.
const base = process.env.BASE_PATH ?? '/tpakweb/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: 'next/image', replacement: r('./src/shims/next-image.tsx') },
      { find: 'next/link', replacement: r('./src/shims/next-link.tsx') },
      {
        find: 'next/navigation',
        replacement: r('./src/shims/next-navigation.ts'),
      },
      { find: '@', replacement: r('.') },
    ],
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 4000,
  },
});
