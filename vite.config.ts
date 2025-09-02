import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'

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
    tanstackStart({ customViteReactPlugin: true }),
    viteReact(),
  ],
  define: {
    global: 'globalThis',
  },
  ssr: {
    noExternal: process.env.NODE_ENV === 'production' ? true : undefined,
  },
})
