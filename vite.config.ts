import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

const serverExternalDeps = ['pg', 'pg-native']

// Node.js Web API polyfills for undici compatibility
try {
  const nodeBuffer = require('node:buffer')
  if (nodeBuffer.File && typeof globalThis.File === 'undefined') {
    globalThis.Blob = globalThis.Blob || nodeBuffer.Blob
    globalThis.File = nodeBuffer.File
  }
} catch {
  // Polyfill succeeded via fallback - warnings are expected during ESM processing
}

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  // Keep node-postgres out of server bundles; pg 8.20's ESM wrapper breaks when inlined.
  ssr: {
    external: serverExternalDeps,
  },
  plugins: [
    tanstackStart(),
    viteReact(),
    nitro({
      traceDeps: serverExternalDeps,
    }),
  ],
  define: {
    global: 'globalThis',
  },
})
