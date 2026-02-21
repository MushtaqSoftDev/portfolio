import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [
    react(),
    // This plugin handles the Three.js WebGPU 'await' error for older browsers
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: (i: number) => `__tla_${i}`
    })
  ],
  build: {
    target: 'esnext', // Ensures modern JS features work in production
    rollupOptions: {
      output: {
        // Ensure WASM files are handled correctly
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.wasm')) {
            return 'wasm/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext' // Ensures modern JS features work in dev mode (locally)
    }
  },
  base: "/",
});
