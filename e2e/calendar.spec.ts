import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => {
    window.localStorage.clear()
    window.localStorage.setItem("theme", "light")
  })
  await page.reload()
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
})

test("supports keyboard date and time editing with explicit confirmation", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add Reminder" }).click()
  const dateTimeField = page.getByRole("textbox", {
    name: "Date and time",
  })

  await dateTimeField.focus()
  await dateTimeField.press("ControlOrMeta+A")
  await dateTimeField.fill("08/20/2026 03:45 PM")
  await dateTimeField.press("Tab")
  await expect(dateTimeField).toHaveValue("08/20/2026 03:45 PM")

  await page
    .getByRole("button", { name: "Choose date, selected date is Aug 20, 2026" })
    .click()
  await page
    .getByRole("dialog")
    .last()
    .getByRole("button", { name: "OK" })
    .click()

  await page
    .getByRole("textbox", { name: "Reminder" })
    .fill("Keyboard picker review")
  await page.getByRole("button", { name: "Save Reminder" }).click()

  const persistedReminderDate = await page.evaluate(() => {
    const serializedReminders = window.localStorage.getItem(
      "portfolio-calendar.reminders",
    )
    if (!serializedReminders) return null

    const reminderStorage = JSON.parse(serializedReminders) as {
      reminders: Array<{ dateISOString: string }>
    }
    const reminderDate = new Date(reminderStorage.reminders[0].dateISOString)
    return {
      year: reminderDate.getFullYear(),
      month: reminderDate.getMonth(),
      day: reminderDate.getDate(),
      hour: reminderDate.getHours(),
      minute: reminderDate.getMinutes(),
    }
  })

  expect(persistedReminderDate).toEqual({
    year: 2026,
    month: 7,
    day: 20,
    hour: 15,
    minute: 45,
  })
})

test("serves only the canonical root without mobile overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.reload()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole("region", { name: "Calendar" })).toBeVisible()
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true)

  await page.getByRole("button", { name: "Add Reminder" }).click()
  const reminderDialog = page.getByRole("dialog", { name: "Add Reminder" })
  await expect(reminderDialog).toBeVisible()

  const reminderDialogBounds = await reminderDialog.boundingBox()
  if (!reminderDialogBounds) throw new Error("Reminder dialog has no bounds")

  expect(reminderDialogBounds.x).toBeGreaterThanOrEqual(0)
  expect(
    reminderDialogBounds.x + reminderDialogBounds.width,
  ).toBeLessThanOrEqual(320)

  const missingRouteResponse = await page.goto("/not-a-calendar-route")
  expect(missingRouteResponse?.status()).toBe(404)
})

test("keeps today anchored while navigating between months", async ({
  page,
}) => {
  const initialMonthHeading = await page
    .getByRole("heading", { level: 1 })
    .textContent()
  const initialCurrentDate = page.locator('button[aria-current="date"]')

  await expect(initialCurrentDate).toHaveCount(1)
  const initialCurrentDateLabel =
    await initialCurrentDate.getAttribute("aria-label")
  expect(initialCurrentDateLabel).toBeTruthy()

  await page.getByRole("button", { name: "Next Month" }).click()

  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(
    initialMonthHeading ?? "",
  )
  const navigatedCurrentDate = page.locator('button[aria-current="date"]')
  const navigatedCurrentDateCount = await navigatedCurrentDate.count()
  expect([0, 1]).toContain(navigatedCurrentDateCount)
  if (navigatedCurrentDateCount === 1) {
    await expect(navigatedCurrentDate).toHaveAttribute(
      "aria-label",
      initialCurrentDateLabel ?? "",
    )
  }

  await page.getByRole("button", { name: "Previous Month" }).click()

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    initialMonthHeading ?? "",
  )
  await expect(page.locator('button[aria-current="date"]')).toHaveAttribute(
    "aria-label",
    initialCurrentDateLabel ?? "",
  )
})

test("switches between reminder icon and hour presentations", async ({
  page,
}) => {
  const showHoursButton = page.getByRole("button", {
    name: "Show reminder hours on the calendar",
  })

  await expect(showHoursButton).toHaveAttribute("aria-pressed", "false")
  await showHoursButton.click()

  const showIconsButton = page.getByRole("button", {
    name: "Show reminder icons on the calendar",
  })
  await expect(showIconsButton).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByText("Hours", { exact: true })).toBeVisible()

  await page.reload()

  await expect(
    page.getByRole("button", {
      name: "Show reminder icons on the calendar",
    }),
  ).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByText("Hours", { exact: true })).toBeVisible()

  await page
    .getByRole("button", { name: "Show reminder icons on the calendar" })
    .click()

  await page.reload()

  await expect(
    page.getByRole("button", {
      name: "Show reminder hours on the calendar",
    }),
  ).toHaveAttribute("aria-pressed", "false")
  await expect(page.getByText("Icons", { exact: true })).toBeVisible()
})

test("persists reminder creation and deletion across reloads", async ({
  page,
}) => {
  const reminderText = "Persistent portfolio review"

  await page.getByRole("button", { name: "Add Reminder" }).click()
  await page.getByRole("textbox", { name: "Reminder" }).fill(reminderText)
  await page.getByRole("button", { name: "Select color Tomato" }).click()
  await page.getByRole("button", { name: "Save Reminder" }).click()

  await expect(page.getByRole("dialog", { name: "Add Reminder" })).toBeHidden()
  await page
    .getByRole("button", { name: "Show reminder hours on the calendar" })
    .click()
  await expect(page.getByText(reminderText)).toBeVisible()

  await page.reload()

  const currentDate = page.locator('button[aria-current="date"]')
  await currentDate.focus()
  await expect(page.getByText(reminderText)).toBeVisible()
  await currentDate.click()

  const agendaDialog = page.getByRole("dialog", { name: /^Agenda:/ })
  await expect(agendaDialog.getByText(reminderText)).toBeVisible()
  await agendaDialog
    .getByRole("button", {
      name: new RegExp(`Delete reminder .* ${reminderText}`),
    })
    .click()
  await expect(agendaDialog.getByRole("status")).toHaveText("No reminders yet.")

  await page.reload()
  await page.locator('button[aria-current="date"]').click()

  await expect(
    page.getByRole("dialog", { name: /^Agenda:/ }).getByRole("status"),
  ).toHaveText("No reminders yet.")
})

