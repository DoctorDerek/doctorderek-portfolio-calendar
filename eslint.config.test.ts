import { ESLint } from "eslint"
import { beforeAll, describe, expect, it } from "vitest"
import packageManifest from "./package.json"

const eslint = new ESLint({ cwd: process.cwd() })

beforeAll(async () => {
  await eslint.calculateConfigForFile("src/pages/index.tsx")
})

describe("TypeScript lint configuration", () => {
  it.each([
    "src/pages/index.tsx",
    "src/components/AddReminder.tsx",
    "src/hooks/useCurrentDate.ts",
    "src/redux/reminderStorage.ts",
    "src/reminderTypes.ts",
    "src/utils/errorUtils.ts",
    "src/components/AddReminder.test.tsx",
    "src/test/renderWithProviders.tsx",
    "e2e/calendar.spec.ts",
    "e2e/playwright.ts",
    "eslint.config.ts",
    "eslint.config.test.ts",
    "next.config.ts",
    "playwright.config.ts",
    "prettier.config.ts",
    "vitest.config.ts",
    "vitest.setup.ts",
    "src/utils/lintProbe.mts",
    "src/utils/lintProbe.cts",
  ])(
    "reports unsafe types in %s without changing advisory severity",
    async (filePath) => {
      const [result] = await eslint.lintText("export type UnsafeValue = any", {
        filePath,
      })

      expect(result.messages).toEqual([
        expect.objectContaining({
          ruleId: "@typescript-eslint/no-explicit-any",
          severity: 1,
        }),
      ])
    },
  )

  it.each([
    "src/components/AddReminder.tsx",
    "src/components/AddReminder.test.tsx",
    "e2e/calendar.spec.ts",
    "vitest.config.ts",
  ])(
    "reports unused imports in %s without test or tooling exemptions",
    async (filePath) => {
      const [result] = await eslint.lintText(
        'import { useRef } from "react"\nexport const value = 1',
        { filePath },
      )

      expect(result.messages).toEqual([
        expect.objectContaining({
          ruleId: "@typescript-eslint/no-unused-vars",
          severity: 1,
        }),
      ])
    },
  )

  it("retains React Hooks rules alongside TypeScript rules", async () => {
    const [result] = await eslint.lintText(
      'import { useState } from "react"; export default function Example({ active }: { active: boolean }) { if (active) useState(0); return null }',
      { filePath: "src/components/AddReminder.tsx" },
    )

    expect(result.messages).toEqual([
      expect.objectContaining({ ruleId: "react-hooks/rules-of-hooks" }),
    ])
  })

  it("accepts valid typed JSX", async () => {
    const [result] = await eslint.lintText(
      "export default function Example({ label }: { label: string }) { return <span>{label}</span> }",
      { filePath: "src/components/AddReminder.tsx" },
    )

    expect(result.messages).toEqual([])
  })

  it("keeps fatal parsing failures as errors", async () => {
    const [result] = await eslint.lintText("export const value =", {
      filePath: "src/utils/errorUtils.ts",
    })

    expect(result.messages).toEqual([
      expect.objectContaining({ fatal: true, severity: 2 }),
    ])
  })
})

describe("lint scope boundaries", () => {
  it("keeps the lint command rooted at the repository, not only src", () => {
    expect(packageManifest.scripts.lint).toBe("eslint .")
  })

  it.each([
    ".next/types/fixture.ts",
    "next-env.d.ts",
    "out/fixture.ts",
    "coverage/fixture.ts",
    "playwright-report/fixture.ts",
    "test-results/fixture.ts",
    "repomix-temp.private.ts",
    "gdd.private.ts",
  ])("keeps generated or private file %s ignored", async (filePath) => {
    expect(await eslint.isPathIgnored(filePath)).toBe(true)
  })

  it("does not apply TypeScript import rules to JavaScript tooling", async () => {
    const [result] = await eslint.lintText('require("node:fs")', {
      filePath: "lintProbe.cjs",
    })

    expect(result.messages).toEqual([])
  })
})
