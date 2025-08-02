import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";

export default defineConfig(() => ({
  base: "/",
  plugins: [TanStackRouterVite(), react(), tailwindcss()],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  },
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  optimizeDeps: {
    include: ["quill", "react-quilljs"],
  },
  build: {
    commonjsOptions: {
      include: [/quill/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
}));