import { expect, test, waitForCalendarHydration } from "./playwright"

test.use({ timezoneId: "UTC", viewport: { width: 320, height: 568 } })

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-26T12:00:00Z"))
  await page.goto("/")
  await page.evaluate(() => {
    const reminders = Array.from({ length: 6 }, (_, index) => ({
      id: `packed-day-${index}`,
      text: `Thursday reminder ${index + 1}`,
      dateISOString: new Date(Date.UTC(2026, 11, 17, 8 + index)).toISOString(),
      color: "DodgerBlue",
    }))
    localStorage.setItem(
      "portfolio-calendar.reminders",
      JSON.stringify({ version: 1, reminders }),
    )
  })
  await page.reload()
  await waitForCalendarHydration(page)
  await page.getByRole("button", { name: "Next Month" }).click()
  await page
    .getByRole("button", { name: "Show reminder hours on the calendar" })
    .click()
})

test("keeps all three actions in thumb reach on a packed day and opens each Add for its own date", async ({
  page,
}) => {
  const day = page.getByRole("button", {
    name: "Thursday December 17, 2026, 6 reminders",
  })
  const add = page.getByRole("button", { name: "Add Reminder", exact: true })
  const previous = page.getByRole("button", { name: "Previous Month" })
  const next = page.getByRole("button", { name: "Next Month" })
  await day.focus()
  for (const control of [add, previous, next]) {
    await expect(control).toBeInViewport({ ratio: 1 })
    const hitInLowerRight = await control.evaluate((button) => {
      const { left, right, top, bottom, width, height } =
        button.getBoundingClientRect()
      const x = (Math.max(left, innerWidth / 2) + right) / 2
      const y = (top + bottom) / 2
      return (
        right > innerWidth / 2 &&
        y > innerHeight * 0.75 &&
        width >= 44 &&
        height >= 44 &&
        button.contains(document.elementFromPoint(x, y))
      )
    })
    expect(hitInLowerRight).toBe(true)
    await page.keyboard.press("Tab")
    await expect(control).toBeFocused()
  }
  for (const control of [previous, add, day]) {
    await page.keyboard.press("Shift+Tab")
    await expect(control).toBeFocused()
  }
  const editor = page.getByRole("dialog", { name: "Add Reminder", exact: true })
  await day.press("Enter")
  const datedAdd = page.getByRole("button", { name: /^Add Reminder for / })
  await datedAdd.click()
  await expect(editor.getByLabel("Date and time")).toHaveValue(/^2026-12-17T/)
  await page.keyboard.press("Escape")
  await expect(datedAdd).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(day).toBeFocused()
  await add.click()
  await expect(editor.getByLabel("Date and time")).toHaveValue(
    "2026-11-26T12:00",
  )
  await page.keyboard.press("Escape")
  await expect(add).toBeFocused()
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
})

test("keeps the weekday labels and actions in place while the short calendar scrolls", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 500 })
  const calendar = page.getByRole("region", { name: "Calendar" })
  const sunday = page.getByRole("columnheader", { name: "Sunday" })
  const actions = page.getByRole("group", { name: "Month navigation" })
  const add = page.getByRole("button", { name: "Add Reminder", exact: true })
  const positions = async () =>
    Promise.all([
      sunday.boundingBox(),
      actions.boundingBox(),
      add.boundingBox(),
    ])
  const before = await positions()
  const moved = await calendar.evaluate((element) => {
    element.scrollTop = element.scrollHeight
    return element.scrollTop
  })
  expect(moved).toBeGreaterThan(0)
  expect(await positions()).toEqual(before)
  expect(await page.evaluate(() => window.scrollY)).toBe(0)
  await actions.getByRole("button", { name: "Previous Month" }).click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "November 2026",
  )
  await actions.getByRole("button", { name: "Next Month" }).click()
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "December 2026",
  )
})

test("keeps a focused month arrow and the active date through both layout transitions", async ({
  page,
}) => {
  const day = page.getByRole("button", {
    name: "Thursday December 17, 2026, 6 reminders",
  })
  await day.focus()
  await page.setViewportSize({ width: 767, height: 740 })
  for (const name of ["Previous Month", "Next Month"]) {
    const arrow = page.getByRole("button", { name, exact: true })
    await expect(arrow).toHaveCount(1)
    await arrow.focus()
    await arrow.evaluate((button) => button.blur())
    await expect(page.locator("body")).toBeFocused()
    await arrow.focus()
    await page.setViewportSize({ width: 768, height: 740 })
    await expect(arrow).toBeFocused()
    await expect(day).toHaveAttribute("tabindex", "0")
    await page.setViewportSize({ width: 767, height: 740 })
    await expect(arrow).toBeFocused()
    await expect(day).toHaveAttribute("tabindex", "0")
  }
})

for (const width of [320, 390]) {
  test(`gives the packed calendar one page scroll at doubled text at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 568 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%"
    })
    const calendar = page.getByRole("region", { name: "Calendar" })
    expect(
      await calendar.evaluate((region) => ({
        gridScroll: region.scrollHeight > region.clientHeight,
        pageScroll: document.documentElement.scrollHeight > innerHeight,
        horizontal: document.documentElement.scrollWidth > innerWidth,
      })),
    ).toEqual({ gridScroll: false, pageScroll: true, horizontal: false })
    const previous = page.getByRole("button", { name: "Previous Month" })
    await previous.scrollIntoViewIfNeeded()
    await expect(previous).toBeInViewport({ ratio: 1 })
    await previous.click()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "November 2026",
    )
  })
}
