import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

const expectNoAccessibilityViolations = async (page: Page) => {
  await page.evaluate(async () => {
    await Promise.allSettled(
      document.getAnimations().map((animation) => animation.finished),
    )
  })
  const { violations } = await new AxeBuilder({ page }).analyze()
  expect(violations).toEqual([])
}

test.beforeEach(async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => {
    window.localStorage.clear()
    window.localStorage.setItem("theme", "light")
  })
  await page.reload()
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
})

test("has no automated violations across primary calendar states", async ({
  page,
}) => {
  await expectNoAccessibilityViolations(page)

  await page.getByRole("button", { name: "Switch to dark theme" }).click()
  await expect(page.locator("html")).toHaveClass(/dark/)
  await expectNoAccessibilityViolations(page)

  await page.getByRole("button", { name: "Switch to light theme" }).click()
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await expect(
    page.getByRole("button", { name: "Switch to dark theme" }),
  ).toBeVisible()
  await page.getByRole("button", { name: "Add Reminder" }).click()
  await expect(page.getByRole("dialog", { name: "Add Reminder" })).toBeVisible()
  await expectNoAccessibilityViolations(page)

  await page.getByRole("button", { name: "Close Add Reminder" }).click()
  await page.locator('button[aria-current="date"]').click()
  await expect(page.getByRole("dialog", { name: /^Agenda:/ })).toBeVisible()
  await expectNoAccessibilityViolations(page)
})

