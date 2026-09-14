import path from "path"
import react from "@vitejs/plugin-react"
import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    coverage: {
      exclude: [
        "src/pages/**",
        "src/test/**",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.cli.ts",
        "src/scripts/xstate-diff/**",
      ],
      include: ["src/**/*.{ts,tsx}"],
      provider: "v8",
      reportOnFailure: true,
      reporter: ["text", "json", "html", "lcov"],
      reportsDirectory: "coverage/vitest",
    },
    environment: "happy-dom",
    exclude: [
      ...configDefaults.exclude,
      "src/scripts/xstate-diff/**/*.test.ts",
    ],
    include: ["**/*.test.tsx", "**/*.test.ts"],
    setupFiles: ["./vitest.setup.ts"],
  },
})
