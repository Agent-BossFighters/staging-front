import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwind from 'tailwindcss'
import { fileURLToPath } from 'url'

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename)
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  resolve: {
    alias: {
      '@pages': path.resolve(_dirname, './src/pages'),
      '@core': path.resolve(_dirname, './src/core'),
      '@features': path.resolve(_dirname, './src/features/'),
      '@ui': path.resolve(_dirname, './src/features/ui'),
      '@css': path.resolve(_dirname, './src/assets/css')
    }
  }
})
