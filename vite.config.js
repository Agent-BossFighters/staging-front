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
      '@api': path.resolve(_dirname, './src/config/api'),
      '@core': path.resolve(_dirname, './src/core'),
      '@css': path.resolve(_dirname, './src/assets/css'),
      '@features': path.resolve(_dirname, './src/features/'),
      '@img': path.resolve(_dirname, './public/img'),
      '@pages': path.resolve(_dirname, './src/pages'),
      '@ui': path.resolve(_dirname, './src/features/ui'),
    }
  }
})
