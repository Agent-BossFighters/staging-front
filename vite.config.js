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
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/utils/api'),
      '@features': path.resolve(__dirname, './src/features'),
      '@img': path.resolve(__dirname, './src/assets/img'),
      '@layout': path.resolve(__dirname, './src/shared/layout'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@ui': path.resolve(__dirname, './src/shared/ui'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  }
})
