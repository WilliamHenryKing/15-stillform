import tailwind from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    host: "127.0.0.1",
    port: 4525,
    strictPort: true,
    watch: { ignored: ["**/output/**", "**/docs/visual/captures/**"] },
  },
  preview: { host: "127.0.0.1", port: 4625, strictPort: true },
  build: { cssMinify: "lightningcss", manifest: true },
});
