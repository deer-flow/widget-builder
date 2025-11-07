import json from "@eslint/json";
import importX from "eslint-plugin-import-x";
import tseslint from "typescript-eslint";

export const base = [
  {
    ignores: ["**/build/**", "**/dist/**"],
  },
  tseslint.configs.recommended,
  {
    plugins: {
      json,
    },
  },
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
