import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [
    react(),
    // This plugin handles the Three.js WebGPU 'await' error for older browsers
    topLevelAwait({
      promiseExportName: "__tla",
      promiseImportName: i => `__tla_${i}`
    })
  ],
  build: {
    target: 'esnext' // Ensures modern JS features work in production
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext' // Ensures modern JS features work in dev mode (locally)
    }
  },
  base: "/", // Added the missing comma before this line!
})
