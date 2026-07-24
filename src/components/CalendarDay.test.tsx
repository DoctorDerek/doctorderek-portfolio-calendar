import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
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
          onActive={() => undefined}
          selectedDate={selectedDate}
          tabIndex={0}
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
    const actualToday = new Date(2026, 6, 14, 12)
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
      storageStatus: { failureMessages: {} },
    }

    renderWithProviders(
      <CalendarDay
        actualToday={actualToday}
        onActive={() => undefined}
        selectedDate={selectedDate}
        tabIndex={0}
        visibleMonth={selectedDate}
      />,
      reminderState,
    )

    const calendarDay = screen.getByRole("button", {
      name: "Wednesday July 15, 2026, 1 reminder",
    })
    const reminderDetails = screen.getByText(/Keyboard review/)

    expect(reminderDetails).toHaveClass("sr-only")

    fireEvent.mouseEnter(calendarDay)

    expect(reminderDetails).not.toHaveClass("sr-only")

    fireEvent.mouseLeave(calendarDay)

    expect(reminderDetails).toHaveClass("sr-only")

    fireEvent.focus(calendarDay)

    expect(reminderDetails).not.toHaveClass("sr-only")

    fireEvent.blur(calendarDay)

    expect(reminderDetails).toHaveClass("sr-only")
  })

  it("strengthens the current-date treatment while the day is focused", () => {
    const selectedDate = new Date(2026, 6, 15, 12)

    renderWithProviders(
      <CalendarDay
        actualToday={selectedDate}
        onActive={() => undefined}
        selectedDate={selectedDate}
        tabIndex={0}
        visibleMonth={selectedDate}
      />,
    )

    const calendarDay = screen.getByRole("button", {
      name: "Wednesday July 15, 2026",
    })
    const dateBadge = screen.getByText("15")

    expect(dateBadge).toHaveClass("bg-purple-700")

    fireEvent.focus(calendarDay)

    expect(dateBadge).toHaveClass("bg-purple-800")

    fireEvent.blur(calendarDay)

    expect(dateBadge).toHaveClass("bg-purple-700")
  })

  it("calls the active-date callback on focus and click", () => {
    const onActive = vi.fn()
    const selectedDate = new Date(2026, 6, 15, 12)

    renderWithProviders(
      <CalendarDay
        actualToday={selectedDate}
        onActive={onActive}
        selectedDate={selectedDate}
        tabIndex={0}
        visibleMonth={selectedDate}
      />,
    )

    const calendarDay = screen.getByRole("button", {
      name: "Wednesday July 15, 2026",
    })

    fireEvent.focus(calendarDay)
    expect(onActive).toHaveBeenCalledTimes(1)

    fireEvent.blur(calendarDay)
    fireEvent.click(calendarDay)
    expect(onActive).toHaveBeenCalledTimes(2)
  })

  it("forwards keyboard events to the supplied keydown handler", () => {
    const onKeyDown = vi.fn()
    const selectedDate = new Date(2026, 6, 15, 12)

    renderWithProviders(
      <CalendarDay
        actualToday={selectedDate}
        onActive={() => undefined}
        onKeyDown={onKeyDown}
        selectedDate={selectedDate}
        tabIndex={0}
        visibleMonth={selectedDate}
      />,
    )

    const calendarDay = screen.getByRole("button", {
      name: "Wednesday July 15, 2026",
    })

    fireEvent.keyDown(calendarDay, { key: "a" })

    expect(onKeyDown).toHaveBeenCalledTimes(1)
  })

  it("shows reminder details immediately when hour view is enabled", () => {
    const selectedDate = new Date(2026, 6, 15, 12)
    const reminderState: RootState = {
      addReminder: { addReminderIsOpen: false, dateISOString: "" },
      agenda: { agendaIsOpen: false, dateISOString: "" },
      reminders: {
        reminders: [
          {
            id: "hour-view",
            dateISOString: "2026-07-15T09:00:00.000Z",
            color: "DodgerBlue",
            text: "Hour view reminder",
          },
        ],
      },
      showHours: { showHours: true },
      storageStatus: { failureMessages: {} },
    }

    renderWithProviders(
      <CalendarDay
        actualToday={selectedDate}
        onActive={() => undefined}
        selectedDate={selectedDate}
        tabIndex={0}
        visibleMonth={selectedDate}
      />,
      reminderState,
    )

    expect(screen.getByText(/Hour view reminder/)).not.toHaveClass("sr-only")
  })
})
