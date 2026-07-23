import { fireEvent, screen } from "@testing-library/react"
import type { Dayjs } from "dayjs"
import { describe, expect, it, vi } from "vitest"
import AddReminder from "@/components/AddReminder"
import type { RootState } from "@/redux/store"
import { renderWithProviders } from "@/test/renderWithProviders"

type MockDateTimePickerProps = {
  label: string
  value: Dayjs | null
  onChange: (value: Dayjs | null) => void
}

vi.mock("@mui/x-date-pickers/DateTimePicker", () => ({
  DateTimePicker: ({ label, value, onChange }: MockDateTimePickerProps) => (
    <div>
      <input
        aria-label={label}
        readOnly
        value={value?.format("MMMM D, YYYY h:mm A") ?? ""}
      />
      <button type="button" onClick={() => onChange(null)}>
        Clear date and time
      </button>
      <span>{value ? "Date selected" : "No date selected"}</span>
    </div>
  ),
}))

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

    expect(screen.getByRole("textbox", { name: "Date and time" })).toHaveValue(
      "July 15, 2026 12:00 PM",
    )

    fireEvent.click(screen.getByRole("button", { name: "Clear date and time" }))
    fireEvent.change(screen.getByRole("textbox", { name: "Reminder" }), {
      target: { value: "No date selected" },
    })

    expect(screen.getByText("No date selected")).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "Date and time" })).toHaveValue(
      "",
    )
    expect(screen.getByRole("button", { name: "Save Reminder" })).toBeDisabled()

    fireEvent.submit(screen.getByRole("form", { name: "Reminder details" }))

    expect(store.getState().reminders.reminders).toEqual([])
  })
})

