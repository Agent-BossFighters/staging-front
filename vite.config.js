import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwind from "tailwindcss";
import { fileURLToPath } from "url";

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(_dirname, "./src"),
      "@api": path.resolve(_dirname, "./src/utils/api"),
      "@constants": path.resolve(_dirname, "./src/constants"),
      "@context": path.resolve(_dirname, "./src/context"),
      "@features": path.resolve(_dirname, "./src/features/"),
      "@img": path.resolve(_dirname, "./src/assets/img"),
      "@layout": path.resolve(_dirname, "./src/shared/layout"),
      "@pages": path.resolve(_dirname, "./src/pages"),
      "@ui": path.resolve(_dirname, "./src/shared/ui"),
      "@utils": path.resolve(_dirname, "./src/utils"),
      "@shared": path.resolve(_dirname, "./src/shared/"),
      "@hooks": path.resolve(_dirname, "./src/shared/hook/"),
    },
  },
});
