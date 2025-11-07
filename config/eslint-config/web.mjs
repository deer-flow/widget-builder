import js from "@eslint/js";
import json from "@eslint/json";
import importX from "eslint-plugin-import-x";
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
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      "import-x": importX,
    },
    settings: {
      "import-x/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin", // Built-in Node.js modules are first
            "external", // External libraries
            "internal", // Internal modules (aliased with @/)
            ["parent", "sibling"], // Relative imports (../ and ./)
            "index", // index imports
            "object",
            "type", // Type imports
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];
