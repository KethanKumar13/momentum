import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("react/") ||
              id.includes("react-dom/") ||
              id.includes("react-router-dom/")
            ) return "vendor";

            if (
              id.includes("framer-motion/") ||
              id.includes("lucide-react/")
            ) return "ui";

            if (id.includes("@radix-ui/")) return "radix";
          }
        },
      },
    },
  },
});