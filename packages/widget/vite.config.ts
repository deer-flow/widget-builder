import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  define: {
    "process.env": {},
    global: "globalThis",
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "DeerWidget",
      fileName: "index",
      formats: ["es", "umd"],
    },
    rollupOptions: {},
  },
});
