// import js from "@eslint/js";
import json from "@eslint/json";
import importX from "eslint-plugin-import-x";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export const web = [
  ...tseslint.configs.recommended,
  {
    files: ["**/*.json", "**/*.jsonc", "**/*.json5"],
    ...json.configs.recommended,
  },
  {
    files: ["**/*.{jsx,tsx}"],
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off", // React 17+ 不需要导入React
      "react/jsx-uses-react": "off", // React 17+ 不需要导入React
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
