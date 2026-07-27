import { fireEvent, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import AddReminderFab from "@/components/AddReminderFab"
import { renderWithProviders } from "@/test/renderWithProviders"

describe("add reminder quick action", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("opens a reminder flow for the current date when no date is provided", () => {
    const fixedNow = new Date(2026, 6, 20, 14, 0, 0)
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(fixedNow)

    const { store } = renderWithProviders(<AddReminderFab />)

    fireEvent.click(screen.getByRole("button", { name: "Add Reminder" }))
    expect(store.getState().addReminder.dateISOString).toBe(
      fixedNow.toISOString(),
    )
  })

  it("shows the add reminder action beside its plus icon", () => {
    renderWithProviders(<AddReminderFab />)

    expect(screen.getByText("Add Reminder")).toBeVisible()
  })

  it("opens a reminder flow for a selected date when one is provided", () => {
    const targetDate = new Date(2026, 6, 21, 9, 30, 0)
    const { store } = renderWithProviders(<AddReminderFab date={targetDate} />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Reminder for July 21, 2026",
      }),
    )

    expect(store.getState().addReminder.dateISOString).toBe(
      targetDate.toISOString(),
    )
  })
})
