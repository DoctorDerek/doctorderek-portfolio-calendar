/**
* ONE-TIME EXCEPTION TO NO CODE COMMENT RULE:
* typescript-eslint (v8.63.0) is broken with TypeScript 7 (v7.0.2)
* until TS 7 releases an API (planned for v7.1.0+)
* TODO Upgrade to TS 7 when the version is >7.1.0 and typescript-eslint is working with TS7
* */

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
