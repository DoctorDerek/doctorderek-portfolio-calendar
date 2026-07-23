import { expect, test, type Page } from "@playwright/test"

const loadWithExplicitTheme = async (
  page: Page,
  themePreference: "light" | "dark",
) => {
  await page.goto("/")
  await page.evaluate((theme) => {
    window.localStorage.clear()
    window.localStorage.setItem("theme", theme)
  }, themePreference)
  await page.reload()
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
}

test("persists explicit light and dark theme preferences", async ({ page }) => {
  await loadWithExplicitTheme(page, "light")

  const lightThemeToggle = page.getByRole("button", {
    name: "Switch to dark theme",
  })
  await expect(lightThemeToggle).toHaveClass(/theme-toggle--light/)
  await expect(page.locator("html")).not.toHaveClass(/dark/)

  await lightThemeToggle.click()

  const darkThemeToggle = page.getByRole("button", {
    name: "Switch to light theme",
  })
  await expect(darkThemeToggle).toHaveClass(/theme-toggle--dark/)
  await expect(page.locator("html")).toHaveClass(/dark/)

  await page.reload()

  await expect(darkThemeToggle).toHaveClass(/theme-toggle--dark/)
  await expect(page.locator("html")).toHaveClass(/dark/)

  await darkThemeToggle.click()
  await expect(lightThemeToggle).toHaveClass(/theme-toggle--light/)
  await expect(page.locator("html")).not.toHaveClass(/dark/)

  await page.reload()

  await expect(lightThemeToggle).toHaveClass(/theme-toggle--light/)
  await expect(page.locator("html")).not.toHaveClass(/dark/)
})

test("resolves the system theme as the operating system scheme changes", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" })
  await page.addInitScript(() => {
    window.localStorage.setItem("theme", "system")
  })
  await page.goto("/")

  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toHaveClass(/theme-toggle--dark/)
  await expect(page.locator("html")).toHaveClass(/dark/)

  await page.emulateMedia({ colorScheme: "light" })

  await expect(
    page.getByRole("button", { name: "Switch to dark theme" }),
  ).toHaveClass(/theme-toggle--light/)
  await expect(page.locator("html")).not.toHaveClass(/dark/)
})

test("hydrates a persisted dark theme without mismatch diagnostics", async ({
  page,
}) => {
  const browserDiagnostics: string[] = []
  page.on("console", (message) => {
    if (message.type() === "error") browserDiagnostics.push(message.text())
  })
  page.on("pageerror", (error) => browserDiagnostics.push(error.message))
  await page.addInitScript(() => {
    window.localStorage.setItem("theme", "dark")
  })

  await page.goto("/")

  await expect(
    page.getByRole("button", { name: "Switch to light theme" }),
  ).toHaveClass(/theme-toggle--dark/)
  expect(
    browserDiagnostics.filter((diagnostic) =>
      /hydration|did not match|server rendered html/i.test(diagnostic),
    ),
  ).toEqual([])
})

test("preserves keyboard focus and honors reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await loadWithExplicitTheme(page, "light")
  const lightThemeToggle = page.getByRole("button", {
    name: "Switch to dark theme",
  })

  await lightThemeToggle.focus()
  await expect(lightThemeToggle).toBeFocused()
  await lightThemeToggle.press("Enter")

  const darkThemeToggle = page.getByRole("button", {
    name: "Switch to light theme",
  })
  await expect(darkThemeToggle).toBeFocused()
  const sunTransitionDuration = await page
    .locator(".sun")
    .evaluate((sun) =>
      Number.parseFloat(window.getComputedStyle(sun).transitionDuration),
    )
  expect(sunTransitionDuration).toBeLessThanOrEqual(0.001)
})

