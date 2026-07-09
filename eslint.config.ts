import { createRequire } from "module"
import path from "path"
import { FlatCompat } from "@eslint/eslintrc"
import gitignore from "eslint-config-flat-gitignore"
import eslintConfigPrettier from "eslint-config-prettier"
import onlyWarn from "eslint-plugin-only-warn"

const require = createRequire(import.meta.url)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: path.dirname(
    require.resolve("eslint-config-next/package.json"),
  ),
})

export default [
  gitignore(),
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      // @ts-expect-error - eslint-plugin-only-warn lacks flat config types
      "only-warn": onlyWarn,
    },
  },
  eslintConfigPrettier,
]
