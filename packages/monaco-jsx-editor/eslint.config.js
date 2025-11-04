import { web } from "@widget-builder/eslint-config/web.mjs";

export default [
  ...web,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
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
      "react/react-in-jsx-scope": "off", // Not needed in React 17+
    },
  },
  {
    ignores: ["dist/", "node_modules/", "**/*.json", "**/*.jsonc"],
  },
];
