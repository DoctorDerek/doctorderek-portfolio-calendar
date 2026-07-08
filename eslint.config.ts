import js from "@eslint/js"
import gitignore from "eslint-config-flat-gitignore"
import onlyWarn from "eslint-plugin-only-warn"
import reactPlugin from "eslint-plugin-react"
import tseslint from "typescript-eslint"

export default tseslint.config(
  gitignore(),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],
  {
    plugins: {
      // @ts-expect-error - eslint-plugin-only-warn lacks flat config types
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
  },
)
