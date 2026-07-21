import { fireEvent, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import AddReminder from "@/components/AddReminder"
import type { RootState } from "@/redux/store"
import { renderWithProviders } from "@/test/renderWithProviders"

const openReminderFormState: RootState = {
  addReminder: {
    addReminderIsOpen: true,
    dateISOString: "2026-07-15T12:00:00",
  },
  agenda: {
    agendaIsOpen: false,
    dateISOString: "2026-07-15T12:00:00",
  },
  reminders: { reminders: [] },
  showHours: { showHours: false },
}

describe("reminder form controls", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("limits reminder text to the visible 30-character allowance", () => {
    renderWithProviders(<AddReminder />, openReminderFormState)

    const reminderTextField = screen.getByRole("textbox", {
      name: "Reminder",
    })

    expect(reminderTextField).toHaveAccessibleDescription("30 characters max")

    fireEvent.change(reminderTextField, {
      target: { value: "12345678901234567890123456789012345" },
    })

    expect(reminderTextField).toHaveValue("123456789012345678901234567890")
    expect(screen.getByText("0 characters remaining")).toBeInTheDocument()
    expect(reminderTextField).toHaveAccessibleDescription(
      "0 characters remaining",
    )
  })

  it("selects a reminder color through its named control", () => {
    renderWithProviders(<AddReminder />, openReminderFormState)

    const reminderColorGroup = screen.getByRole("group", {
      name: "Reminder color",
    })

    fireEvent.click(
      within(reminderColorGroup).getByRole("button", {
        name: "Select color Tomato",
      }),
    )

    expect(
      within(reminderColorGroup).getByRole("button", {
        name: "Selected color is Tomato",
      }),
    ).toBeInTheDocument()
    expect(
      within(reminderColorGroup).getByRole("button", {
        name: "Select color DodgerBlue",
      }),
    ).toBeInTheDocument()
  })

  it("keeps saving disabled until reminder text contains content", () => {
    renderWithProviders(<AddReminder />, openReminderFormState)

    const reminderTextField = screen.getByRole("textbox", {
      name: "Reminder",
    })
    const saveReminderButton = screen.getByRole("button", {
      name: "Save Reminder",
    })

    expect(saveReminderButton).toBeDisabled()

    fireEvent.change(reminderTextField, { target: { value: "   " } })

    expect(saveReminderButton).toBeDisabled()

    fireEvent.change(reminderTextField, {
      target: { value: "Portfolio review" },
    })

    expect(saveReminderButton).toBeEnabled()
  })

  it("uses the current time when no initiating date was requested", () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2026, 6, 20, 14, 30))

    renderWithProviders(<AddReminder />, {
      ...openReminderFormState,
      addReminder: {
        ...openReminderFormState.addReminder,
        dateISOString: "",
      },
    })

    expect(
      screen.getByRole("textbox", {
        name: "Choose date and time, selected date and time is July 20, 2026 2:30 PM",
      }),
    ).toBeInTheDocument()
  })

  it("ignores direct form submission while reminder text is empty", () => {
    const { store } = renderWithProviders(
      <AddReminder />,
      openReminderFormState,
    )

    fireEvent.submit(screen.getByRole("form", { name: "Reminder details" }))

    expect(store.getState().reminders.reminders).toEqual([])
    expect(
      screen.getByRole("dialog", { name: "Add Reminder" }),
    ).toBeInTheDocument()
  })

})
