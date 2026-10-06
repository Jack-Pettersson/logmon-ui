import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { logmonUi } from '../vite/index.js';

export default defineConfig({
  plugins: [react(), tailwindcss(), logmonUi()],
  build: { outDir: '../dist/gallery', emptyOutDir: true },
});
