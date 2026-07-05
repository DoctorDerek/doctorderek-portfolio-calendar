module.exports = {
  tabWidth: 2,
  useTabs: false,
  endOfLine: "lf",
  semi: false,
  singleQuote: true,
  printWidth: 80,
  trailingComma: "es5",
  bracketSpacing: true,
  plugins: ["@ianvs/prettier-plugin-sort-imports"],
  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/(.*)$",
    "^[./]"
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
  importOrderTypeScriptVersion: "4.9.5"
}
