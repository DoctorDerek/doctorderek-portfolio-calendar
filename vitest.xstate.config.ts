import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    include: ["src/scripts/xstate-diff/**/*.test.ts"],
    coverage: {
      include: ["src/scripts/xstate-diff/**/*.ts"],
      exclude: ["src/scripts/xstate-diff/xstateDiff.cli.ts"],
      reportOnFailure: true,
      reporter: ["text", "json-summary", "lcov"],
      reportsDirectory: "coverage/xstate",
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
  },
})
