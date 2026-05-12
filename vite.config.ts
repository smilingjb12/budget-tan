import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'

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
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart(),
    viteReact(),
    nitro({
      config: {
        externals: {
          external: ['pg', 'pg-native'],
        },
      },
    }),
  ],
  define: {
    global: 'globalThis',
  },
})
