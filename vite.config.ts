import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Force using the WebAssembly version of Rollup for Vercel compatibility
process.env.ROLLUP_WASM = "true";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true,
    // Simplified build options
    minify: true,
    outDir: "dist"
  }
});
