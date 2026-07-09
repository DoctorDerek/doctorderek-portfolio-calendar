import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
// @ts-expect-error - eslint-config-prettier lacks types
import eslintConfigPrettier from "eslint-config-prettier"
import gitignore from "eslint-config-flat-gitignore"
import onlyWarn from "eslint-plugin-only-warn"

export default [
  gitignore(),
  ...nextCoreWebVitals,
  {
    plugins: {
      "only-warn": onlyWarn,
    },
  },
  eslintConfigPrettier,
]
