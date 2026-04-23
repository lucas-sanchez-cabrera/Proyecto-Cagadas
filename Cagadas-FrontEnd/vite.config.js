import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    // En Docker sobre Windows, los eventos de archivos pueden no propagarse;
    // polling asegura que Vite detecte cambios y recargue sin reiniciar.
    watch: {
      usePolling: true,
      interval: 250,
    },
    hmr: {
      host: "localhost",
      port: 5173,
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
