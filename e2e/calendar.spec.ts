import { expect, test, waitForCalendarHydration } from "./playwright"

test.beforeEach(async ({ page }) => {
  await page.goto("/")
  await page.evaluate(() => {
    window.localStorage.clear()
    window.localStorage.setItem("theme", "light")
  })
  await page.reload()
  await waitForCalendarHydration(page)
})

for (const width of [320, 390]) {
  test(`keeps the calendar and reminder editor usable with enlarged text at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 })
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%"
    })
    await page.evaluate(async () => {
      await document.fonts.ready
    })
    const rootWidth = await page.evaluate(() => ({
      width: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }))
    expect(rootWidth.scroll).toBeLessThanOrEqual(rootWidth.width)
    const addReminder = page.getByRole("button", {
      name: "Add Reminder",
      exact: true,
    })
    expect((await addReminder.boundingBox())!.height).toBeGreaterThanOrEqual(44)
    await page
      .getByRole("button", { name: "Add Reminder", exact: true })
      .click()
    const dialog = page.getByRole("dialog", {
      name: "Add Reminder",
      exact: true,
    })
    await expect(dialog).toBeVisible()
    const geometry = await dialog.evaluate((element) => ({
      width: element.clientWidth,
      scroll: element.scrollWidth,
      left: element.getBoundingClientRect().left,
      right: element.getBoundingClientRect().right,
    }))
    expect(geometry.left).toBeGreaterThanOrEqual(0)
    expect(geometry.right).toBeLessThanOrEqual(width)
    expect(geometry.scroll).toBeLessThanOrEqual(geometry.width)
    const dateTime = dialog.getByLabel("Date and time")
    const date = (await dateTime.inputValue()).split("T")[0]
    await dateTime.fill(`${date}T03:00`)
    await dateTime.press("Tab")
    await expect(dateTime).toHaveValue(`${date}T03:00`)
    await dialog
      .getByRole("textbox", { name: "Reminder", exact: true })
      .fill("Enlarged text review")
    await dialog
      .getByRole("button", { name: "Save Reminder", exact: true })
      .click()
    await expect(dialog).toBeHidden()
    await page.locator('button[aria-current="date"]').click()
    const agenda = page.getByRole("dialog", { name: /^Agenda:/ })
    await expect(agenda.getByText("Enlarged text review")).toBeVisible()
    const agendaWidth = await agenda.evaluate((element) => ({
      width: element.clientWidth,
      scroll: element.scrollWidth,
    }))
    expect(agendaWidth.scroll).toBeLessThanOrEqual(agendaWidth.width)
  })
}

test("shows all reminder colors and both actions on a short phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 568 })
  const opener = page.getByRole("button", { name: "Add Reminder", exact: true })
  await opener.focus()
  await page.keyboard.press("Enter")
  const editor = page.getByRole("dialog", { name: "Add Reminder" })
  const colors = editor
    .getByRole("group", { name: "Reminder color" })
    .getByRole("button")
  await expect(colors).toHaveCount(8)
  for (const color of await colors.all()) {
    await expect(color).toBeInViewport({ ratio: 1 })
    const bounds = await color.boundingBox()
    expect(bounds!.width).toBeGreaterThanOrEqual(44)
    expect(bounds!.height).toBeGreaterThanOrEqual(44)
  }
  const save = editor.getByRole("button", { name: "Save Reminder" })
  const cancel = editor.getByRole("button", { name: "Cancel" })
  await expect(save).toBeInViewport({ ratio: 1 })
  await expect(cancel).toBeInViewport({ ratio: 1 })
  expect((await save.boundingBox())!.y).toBeCloseTo(
    (await cancel.boundingBox())!.y,
    0,
  )
  await expect(editor).toHaveJSProperty("scrollTop", 0)
  await page.keyboard.press("Escape")
  await expect(editor).toBeHidden()
  await expect(opener).toBeFocused()
  await opener.click()
  await cancel.click()
  await expect(editor).toBeHidden()
})

test("supports keyboard date and time editing with explicit confirmation", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add Reminder" }).click()
  const dateTime = page.getByLabel("Date and time")
  await dateTime.focus()
  await dateTime.fill("2026-08-20T15:45")
  await dateTime.press("Tab")
  await expect(dateTime).toHaveValue("2026-08-20T15:45")
  await expect(
    page.getByRole("button", { name: "Save Reminder" }),
  ).toBeDisabled()

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

test("serves the decorative background through bounded responsive WebP optimization", async ({
  page,
}) => {
  const backgroundImage = page.locator('img[alt=""]')
  const optimizedSource = await backgroundImage.getAttribute("src")
  const responsiveSources = await backgroundImage.getAttribute("srcset")

  if (!optimizedSource || !responsiveSources) {
    throw new Error("The decorative background is missing responsive sources")
  }

  const optimizedSourceUrl = new URL(optimizedSource, page.url())
  const backgroundSourcePath =
    /^\/_next\/static\/(?:immutable\/)?media\/benjamin-patin-dOzoyaYjCbM-unsplash\.[a-z0-9]+\.jpg$/
  const optimizedBackgroundResponse = await page.request.get(
    optimizedSourceUrl.toString(),
    {
      headers: { accept: "image/webp" },
    },
  )

  expect(optimizedSourceUrl.pathname).toBe("/_next/image")
  expect(optimizedSourceUrl.searchParams.get("url")).toMatch(
    backgroundSourcePath,
  )
  expect([640, 1280, 1920, 2880, 3840]).toContain(
    Number(optimizedSourceUrl.searchParams.get("w")),
  )
  expect(optimizedSourceUrl.searchParams.get("q")).toBe("75")

  const responsiveSourceCandidates = responsiveSources
    .split(",")
    .map((responsiveSourceCandidate) => {
      const normalizedSourceCandidate = responsiveSourceCandidate.trim()
      const descriptorSeparatorIndex =
        normalizedSourceCandidate.lastIndexOf(" ")

      if (descriptorSeparatorIndex === -1) {
        throw new Error(
          `Responsive image candidate has no width descriptor: ${normalizedSourceCandidate}`,
        )
      }

      return {
        sourceUrl: new URL(
          normalizedSourceCandidate.slice(0, descriptorSeparatorIndex),
          page.url(),
        ),
        widthDescriptor: normalizedSourceCandidate.slice(
          descriptorSeparatorIndex + 1,
        ),
      }
    })

  expect(
    responsiveSourceCandidates.map(({ widthDescriptor }) => widthDescriptor),
  ).toEqual(["640w", "1280w", "1920w", "2880w", "3840w"])

  for (const { sourceUrl, widthDescriptor } of responsiveSourceCandidates) {
    expect(sourceUrl.pathname).toBe("/_next/image")
    expect(sourceUrl.searchParams.get("url")).toMatch(backgroundSourcePath)
    expect(sourceUrl.searchParams.get("w")).toBe(
      widthDescriptor.replace(/w$/, ""),
    )
    expect(sourceUrl.searchParams.get("q")).toBe("75")
  }

  expect(optimizedBackgroundResponse.ok()).toBe(true)
  expect(optimizedBackgroundResponse.headers()["content-type"]).toContain(
    "image/webp",
  )
})

test("self-hosts Roboto without runtime Google font requests", async ({
  page,
}) => {
  const googleFontRequests: string[] = []
  page.on("request", (request) => {
    const requestHostname = new URL(request.url()).hostname
    if (
      requestHostname === "fonts.googleapis.com" ||
      requestHostname === "fonts.gstatic.com"
    ) {
      googleFontRequests.push(request.url())
    }
  })

  await page.reload()

  await expect(page.locator('link[href*="fonts.googleapis.com"]')).toHaveCount(
    0,
  )
  expect(
    await page
      .getByRole("heading", { level: 1 })
      .evaluate((heading) => getComputedStyle(heading).fontFamily),
  ).toContain("Roboto")
  expect(googleFontRequests).toHaveLength(0)
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
  await expect(reminderItem).toHaveCSS("--reminder-color", "tomato")
})

test("respects the reduced-motion preference for reminder lifecycle transitions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.reload()

  await page.getByRole("button", { name: "Add Reminder" }).click()
  await page
    .getByRole("textbox", { name: "Reminder" })
    .fill("Reduced motion review")
  await page.getByRole("button", { name: "Save Reminder" }).click()

  const currentDateButton = page.locator('button[aria-current="date"]')
  await currentDateButton.click()

  const agendaDialog = page.getByRole("dialog", { name: /^Agenda:/ })
  const reminderItem = agendaDialog.locator("li", {
    hasText: "Reduced motion review",
  })
  await expect(reminderItem).toBeVisible()

  const reducedMotionState = await reminderItem.evaluate((element) => ({
    animationCount: element.getAnimations().length,
    transform: getComputedStyle(element).transform,
  }))
  expect(reducedMotionState).toEqual({
    animationCount: 0,
    transform: "none",
  })
})

test("preserves neighboring agenda reminders after a Motion exit", async ({
  page,
}) => {
  for (const reminderText of [
    "First lifecycle reminder",
    "Second lifecycle reminder",
  ]) {
    await page.getByRole("button", { name: "Add Reminder" }).click()
    await page.getByRole("textbox", { name: "Reminder" }).fill(reminderText)
    await page.getByRole("button", { name: "Save Reminder" }).click()
    await expect(
      page.getByRole("dialog", { name: "Add Reminder" }),
    ).toBeHidden()
  }

  const currentDateButton = page.locator('button[aria-current="date"]')
  await currentDateButton.focus()
  await currentDateButton.press("Enter")
  const agendaDialog = page.getByRole("dialog", { name: /^Agenda:/ })
  await expect(agendaDialog).toBeVisible()
  const reminderList = agendaDialog.getByRole("list", {
    name: /^Reminders for /,
  })
  await expect(reminderList.getByRole("listitem")).toHaveCount(2)

  await reminderList
    .getByRole("button", {
      name: /Delete reminder .* First lifecycle reminder/,
    })
    .click()

  await expect(reminderList.getByText("First lifecycle reminder")).toHaveCount(
    0,
  )
  await expect(
    reminderList.getByText("Second lifecycle reminder"),
  ).toBeVisible()
  await expect(reminderList.getByRole("listitem")).toHaveCount(1)
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
  const today = page.locator('button[aria-current="date"]')
  await expect(today).toHaveCount(1)
  await expect(today).toHaveAccessibleName(/./)
  const weeks = page
    .getByRole("row")
    .filter({ has: page.getByRole("gridcell") })
  const thisWeek = weeks.nth(1).getByRole("button")
  const nextWeek = weeks.nth(2).getByRole("button")
  const sunday = nextWeek.first()

  await thisWeek.nth(3).focus()
  await page.keyboard.press("ArrowRight")
  await expect(thisWeek.nth(4)).toBeFocused()
  await page.keyboard.press("ArrowDown")
  await expect(nextWeek.nth(4)).toBeFocused()
  await page.keyboard.press("Home")
  await expect(sunday).toBeFocused()
  await page.keyboard.press("Home")
  await expect(sunday).toBeFocused()

  await page.keyboard.press("Enter")
  const agendaDialog = page.getByRole("dialog", { name: /^Agenda:/ })
  await expect(agendaDialog).toBeVisible()
  await expect(
    agendaDialog.getByRole("button", { name: /^Close Agenda: / }),
  ).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(agendaDialog).toBeHidden()
  await expect(sunday).toBeFocused()
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
