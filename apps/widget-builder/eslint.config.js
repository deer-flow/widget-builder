import { web } from "@widget-builder/eslint-config/web.mjs";
import { defineConfig } from "eslint/config";

export default defineConfig(web, {
  ignores: ["dist/", "node_modules/", "**/*.json", "**/*.jsonc"],
});
