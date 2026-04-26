import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/",
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 25952,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: { strict: true },
  },
  preview: {
    port: 25952,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
