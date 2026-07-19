import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import App from "@/components/App"
import type { RootState } from "@/redux/store"
import { renderWithProviders } from "@/test/renderWithProviders"

describe("reminder dialog interactions", () => {
  it("opens and closes through the named application controls", async () => {
    renderWithProviders(<App />)

    fireEvent.click(screen.getByRole("button", { name: "Add Reminder" }))

    expect(
      screen.getByRole("dialog", { name: "Add Reminder" }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Close Add Reminder" }))

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Add Reminder" }),
      ).not.toBeInTheDocument()
    })
  })

  it("requests the current date instead of stale agenda context globally", () => {
    const previousAgendaDateISOString = "2025-01-10T09:00:00.000Z"
    const preloadedState: RootState = {
      addReminder: { addReminderIsOpen: false, dateISOString: "" },
      agenda: {
        agendaIsOpen: false,
        dateISOString: previousAgendaDateISOString,
      },
      reminders: { reminders: [] },
      reset: {},
      showHours: { showHours: false },
    }
    const { store } = renderWithProviders(<App />, preloadedState)
    const earliestRequestedTimestamp = Date.now()

    fireEvent.click(screen.getByRole("button", { name: "Add Reminder" }))

    const latestRequestedTimestamp = Date.now()
    const requestedTimestamp = new Date(
      store.getState().addReminder.dateISOString,
    ).getTime()
    expect(requestedTimestamp).toBeGreaterThanOrEqual(
      earliestRequestedTimestamp,
    )
    expect(requestedTimestamp).toBeLessThanOrEqual(latestRequestedTimestamp)
    expect(store.getState().addReminder.dateISOString).not.toBe(
      previousAgendaDateISOString,
    )
  })

  it("cancels typed reminder text without adding it to the calendar", async () => {
    renderWithProviders(<App />)

    fireEvent.click(screen.getByRole("button", { name: "Add Reminder" }))
    fireEvent.change(screen.getByRole("textbox", { name: "Reminder" }), {
      target: { value: "Cancelled reminder" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Add Reminder" }),
      ).not.toBeInTheDocument()
    })
    expect(screen.queryByText("Cancelled reminder")).not.toBeInTheDocument()
  })

  it("dismisses typed reminder text without adding it to the calendar", async () => {
    renderWithProviders(<App />)

    fireEvent.click(screen.getByRole("button", { name: "Add Reminder" }))
    fireEvent.change(screen.getByRole("textbox", { name: "Reminder" }), {
      target: { value: "Dismissed reminder" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Close Add Reminder" }))

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Add Reminder" }),
      ).not.toBeInTheDocument()
    })
    expect(screen.queryByText("Dismissed reminder")).not.toBeInTheDocument()
  })

  it("adds reminder text to the calendar through the explicit save action", async () => {
    renderWithProviders(<App />)

    fireEvent.click(screen.getByRole("button", { name: "Add Reminder" }))
    fireEvent.change(screen.getByRole("textbox", { name: "Reminder" }), {
      target: { value: "Portfolio review" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Save Reminder" }))

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Add Reminder" }),
      ).not.toBeInTheDocument()
    })
    expect(screen.getByText("Portfolio review")).toBeInTheDocument()
  })

  it("normalizes reminder text submitted through the named form", async () => {
    const { store } = renderWithProviders(<App />)

    fireEvent.click(screen.getByRole("button", { name: "Add Reminder" }))
    fireEvent.change(screen.getByRole("textbox", { name: "Reminder" }), {
      target: { value: "   Planning session   " },
    })
    fireEvent.submit(screen.getByRole("form", { name: "Reminder details" }))

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Add Reminder" }),
      ).not.toBeInTheDocument()
    })
    expect(screen.getByText("Planning session")).toBeInTheDocument()
    expect(store.getState().reminders.reminders[0].text).toBe(
      "Planning session",
    )
  })
})
