import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import AddReminder from "@/components/AddReminder"
import type { RootState } from "@/redux/store"
import { renderWithProviders } from "@/test/renderWithProviders"

const openReminderFormState: RootState = {
  addReminder: {
    addReminderIsOpen: true,
    dateISOString: "2026-07-15T12:00:00",
  },
  agenda: { agendaIsOpen: false, dateISOString: "" },
  reminders: { reminders: [] },
  showHours: { showHours: false },
  storageStatus: { failureMessages: {} },
}

describe("reminder date and time selection", () => {
  it("keeps submission disabled after the date and time is cleared", () => {
    const { store } = renderWithProviders(
      <AddReminder />,
      openReminderFormState,
    )

    expect(screen.getByLabelText("Date and time")).toHaveValue(
      "2026-07-15T12:00",
    )

    fireEvent.change(screen.getByLabelText("Date and time"), {
      target: { value: "" },
    })
    fireEvent.change(screen.getByRole("textbox", { name: "Reminder" }), {
      target: { value: "No date selected" },
    })

    expect(screen.getByLabelText("Date and time")).toHaveValue("")
    expect(screen.getByRole("button", { name: "Save Reminder" })).toBeDisabled()

    fireEvent.submit(screen.getByRole("form", { name: "Reminder details" }))

    expect(store.getState().reminders.reminders).toEqual([])
  })
})
