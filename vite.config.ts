import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'

// Node.js Web API polyfills
try {
  // Try Node.js 20+ first
  const nodeBuffer = require('node:buffer')
  if (nodeBuffer.File && typeof globalThis.File === 'undefined') {
    globalThis.Blob = globalThis.Blob || nodeBuffer.Blob
    globalThis.File = nodeBuffer.File
  }
} catch (error) {
  try {
    // Fallback to older buffer module
    const { Blob } = require('buffer')
    if (typeof globalThis.Blob === 'undefined') {
      globalThis.Blob = Blob
    }
    if (typeof globalThis.File === 'undefined') {
      // Minimal File polyfill extending Blob
      globalThis.File = class File extends Blob {
        constructor(fileBits, fileName, options = {}) {
          super(fileBits, options)
          this.name = fileName
          this.lastModified = options.lastModified || Date.now()
        }
      }
    }
  } catch (fallbackError) {
    console.warn('Could not polyfill File/Blob APIs:', fallbackError)
  }
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
