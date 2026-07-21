import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import AgendaDay from "@/components/AgendaDay"
import CalendarDay from "@/components/CalendarDay"
import type { RootState } from "@/redux/store"
import { renderWithProviders } from "@/test/renderWithProviders"

describe("calendar day interactions", () => {
  it("opens the matching daily agenda through the named day control", () => {
    const selectedDate = new Date(2026, 6, 15, 12)

    renderWithProviders(
      <>
        <CalendarDay
          actualToday={selectedDate}
          selectedDate={selectedDate}
          visibleMonth={selectedDate}
        />
        <AgendaDay />
      </>,
    )

    fireEvent.click(
      screen.getByRole("button", { name: "Wednesday July 15, 2026" }),
    )

    expect(
      screen.getByRole("dialog", { name: "Agenda: July 15, 2026" }),
    ).toBeInTheDocument()
  })

  it("reveals icon-only reminder details when the day receives keyboard focus", () => {
    const selectedDate = new Date(2026, 6, 15, 12)
    const reminderState: RootState = {
      addReminder: { addReminderIsOpen: false, dateISOString: "" },
      agenda: { agendaIsOpen: false, dateISOString: "" },
      reminders: {
        reminders: [
          {
            id: "keyboard-review",
            dateISOString: "2026-07-15T09:00:00.000Z",
            color: "DodgerBlue",
            text: "Keyboard review",
          },
        ],
      },
      showHours: { showHours: false },
    }

    renderWithProviders(
      <CalendarDay
        actualToday={selectedDate}
        selectedDate={selectedDate}
        visibleMonth={selectedDate}
      />,
      reminderState,
    )

    const calendarDay = screen.getByRole("button", {
      name: "Wednesday July 15, 2026",
    })
    const reminderDetails = screen.getByText(/Keyboard review/)

    expect(reminderDetails).toHaveClass("sr-only")

    fireEvent.focus(calendarDay)

    expect(reminderDetails).not.toHaveClass("sr-only")

    fireEvent.blur(calendarDay)

    expect(reminderDetails).toHaveClass("sr-only")
  })
})
