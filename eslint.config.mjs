import js from "@eslint/js";
import gitignore from "eslint-config-flat-gitignore";
import reactPlugin from "eslint-plugin-react";
import tseslint from "typescript-eslint";

import onlyWarn from "eslint-plugin-only-warn";

export default tseslint.config(
  gitignore(),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    plugins: {
      "only-warn": onlyWarn,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
    },
  }
);
