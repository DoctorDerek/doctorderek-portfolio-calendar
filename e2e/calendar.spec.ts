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

test("saves a selected reminder color and exposes it in the agenda list", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add Reminder" }).click()
  await page.getByRole("textbox", { name: "Reminder" }).fill("Violet mode")
  await page.getByRole("button", { name: "Select color Tomato" }).click()
  await page.getByRole("button", { name: "Save Reminder" }).click()

  await expect(page.getByRole("dialog", { name: "Add Reminder" })).toBeHidden()

  const currentDateButton = page.locator('button[aria-current="date"]')
  await currentDateButton.click()

  const agendaDialog = page.getByRole("dialog", { name: /^Agenda:/ })
  await expect(agendaDialog).toBeVisible()

  const reminderItem = agendaDialog.locator("li", { hasText: "Violet mode" })
  await expect(reminderItem).toBeVisible()
  await expect(reminderItem).toHaveAttribute(
    "style",
    /--agenda-reminder-color:\s*Tomato/,
  )
})

test("opens agenda-scoped Add Reminder using the day-specific action", async ({
  page,
}) => {
  const currentDateButton = page.locator('button[aria-current="date"]')
  await currentDateButton.click()

  const agendaDialog = page.getByRole("dialog", { name: /^Agenda:/ })
  await expect(agendaDialog).toBeVisible()

  const agendaReminderButton = agendaDialog.getByRole("button", {
    name: /^Add Reminder for /,
  })
  await agendaReminderButton.click()

  const addReminderDialog = page.getByRole("dialog", { name: "Add Reminder" })
  await expect(addReminderDialog).toBeVisible()
  await page
    .getByRole("textbox", { name: "Reminder" })
    .fill("Agenda-scoped reminder")
  await page.getByRole("button", { name: "Save Reminder" }).click()

  await expect(addReminderDialog).toBeHidden()
  await expect(agendaDialog.getByText("Agenda-scoped reminder")).toBeVisible()
})

test("supports calendar keyboard traversal and opens agenda on Enter", async ({
  page,
}) => {
  const currentDateButton = page.locator('button[aria-current="date"]')
  await expect(currentDateButton).toHaveCount(1)

  const initialFocusedLabel = await currentDateButton.getAttribute("aria-label")
  expect(initialFocusedLabel).toBeTruthy()

  await currentDateButton.focus()
  await page.keyboard.press("ArrowRight")

  const rightFocusLabel = await page.evaluate(() => {
    return document.activeElement?.getAttribute("aria-label")
  })
  expect(rightFocusLabel).toBeTruthy()
  expect(rightFocusLabel).not.toBe(initialFocusedLabel)

  await page.keyboard.press("ArrowDown")
  const downFocusLabel = await page.evaluate(() => {
    return document.activeElement?.getAttribute("aria-label")
  })
  expect(downFocusLabel).toBeTruthy()
  expect(downFocusLabel).not.toBe(rightFocusLabel)

  await page.keyboard.press("Home")
  const homeFocusLabel = await page.evaluate(() => {
    return document.activeElement?.getAttribute("aria-label")
  })
  expect(homeFocusLabel).toBeTruthy()
  expect(homeFocusLabel).not.toBe(downFocusLabel)

  await page.keyboard.press("Enter")
  const agendaDialog = page.getByRole("dialog", { name: /^Agenda:/ })
  await expect(agendaDialog).toBeVisible()

  const closeAgenda = agendaDialog.getByRole("button", {
    name: /^Close Agenda: /,
  })
  await expect(closeAgenda).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(agendaDialog).toBeHidden()

  const nextFocusedLabel = await page.evaluate(() => {
    return document.activeElement?.getAttribute("aria-label")
  })
  expect(nextFocusedLabel).toBe(homeFocusLabel)
})

test("moves focus out of calendar with Tab", async ({ page }) => {
  const activeDateButton = page.locator('button[aria-current="date"]')
  await activeDateButton.focus()
  await page.keyboard.press("Tab")

  await expect(page.getByRole("button", { name: "Add Reminder" })).toBeFocused()
})

test("moves focus back to month controls with Shift+Tab", async ({ page }) => {
  const activeDateButton = page.locator('button[aria-current="date"]')
  await activeDateButton.focus()
  await page.keyboard.press("Shift+Tab")

  await expect(page.getByRole("button", { name: "Next Month" })).toBeFocused()
})

test("does not wrap focus when navigating calendar edges", async ({ page }) => {
  const calendar = page.getByRole("grid")
  const buttons = calendar.getByRole("button")
  const buttonCount = await buttons.count()

  const firstGridButton = buttons.first()
  const firstLabel = await firstGridButton.getAttribute("aria-label")
  await firstGridButton.focus()
  await page.keyboard.press("ArrowLeft")
  await expect(firstGridButton).toBeFocused()
  expect(await firstGridButton.getAttribute("aria-label")).toBe(firstLabel)

  const lastGridButton = buttons.nth(buttonCount - 1)
  const lastLabel = await lastGridButton.getAttribute("aria-label")
  await lastGridButton.focus()
  await page.keyboard.press("ArrowRight")
  await expect(lastGridButton).toBeFocused()
  expect(await lastGridButton.getAttribute("aria-label")).toBe(lastLabel)
})

test("returns focus to Add Reminder after closing with Escape", async ({
  page,
}) => {
  const addReminderButton = page.getByRole("button", { name: "Add Reminder" })

  await addReminderButton.focus()
  await page.keyboard.press("Enter")

  const addReminderDialog = page.getByRole("dialog", { name: "Add Reminder" })
  await expect(addReminderDialog).toBeVisible()
  await page.keyboard.press("Escape")

  await expect(addReminderDialog).toBeHidden()
  await expect(addReminderButton).toBeFocused()
})

test("returns focus to the active date after closing agenda with Escape", async ({
  page,
}) => {
  const currentDateButton = page.locator('button[aria-current="date"]')
  await currentDateButton.focus()
  await page.keyboard.press("Enter")

  const agendaDialog = page.getByRole("dialog", { name: /^Agenda:/ })
  await expect(agendaDialog).toBeVisible()

  await page.keyboard.press("Escape")
  await expect(agendaDialog).toBeHidden()
  await expect(currentDateButton).toBeFocused()
})

test("returns focus to the active date after clicking agenda close", async ({
  page,
}) => {
  const currentDateButton = page.locator('button[aria-current="date"]')
  await currentDateButton.focus()
  await page.keyboard.press("Enter")

  const agendaDialog = page.getByRole("dialog", { name: /^Agenda:/ })
  await expect(agendaDialog).toBeVisible()

  await agendaDialog.getByRole("button", { name: /^Close Agenda: / }).click()

  await expect(agendaDialog).toBeHidden()
  await expect(currentDateButton).toBeFocused()
})

test("submits reminder with Enter and closes Add Reminder dialog", async ({
  page,
}) => {
  const addReminderButton = page.getByRole("button", { name: "Add Reminder" })
  await addReminderButton.click()

  const reminderInput = page.getByRole("textbox", { name: "Reminder" })
  await reminderInput.fill("Enter-saves reminder")
  await page.keyboard.press("Enter")

  const addReminderDialog = page.getByRole("dialog", { name: "Add Reminder" })
  await expect(addReminderDialog).toBeHidden()
  await expect(page.getByText("Enter-saves reminder")).toBeVisible()
})
