import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import viteReact from '@vitejs/plugin-react'

// Proper Node.js polyfills for Web APIs
import { Blob, File } from 'node:buffer'

if (typeof globalThis.Blob === 'undefined') {
  globalThis.Blob = Blob
}
if (typeof globalThis.File === 'undefined') {
  globalThis.File = File
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
