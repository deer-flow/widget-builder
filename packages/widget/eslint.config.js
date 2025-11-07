import { web } from "@widget-builder/eslint-config/web.mjs";

export default [
  ...web,
  {
    ignores: ["dist/", "node_modules/", "**/*.json", "**/*.jsonc"],
  },
];
