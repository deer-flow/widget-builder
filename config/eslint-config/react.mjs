import pluginReact from "eslint-plugin-react";

import { base } from "./base.mjs";

export const react = [
  ...base,
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
];
