import js from "@eslint/js";
import json from "@eslint/json";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export const web = [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.json", "**/*.jsonc", "**/*.json5"],
    ...json.configs.recommended,
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];
