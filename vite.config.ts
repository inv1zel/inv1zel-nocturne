import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base for the hash-routed static build, so it works from any folder.
  base: process.env.VITE_HASH_ROUTER === '1' ? './' : '/',
  plugins: [react()],
  server: { port: 5173, host: true },
  preview: { port: 4173, host: true },
  build: { target: 'es2020', cssCodeSplit: true },
});
