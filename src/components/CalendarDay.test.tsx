import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import CalendarDay from "@/components/CalendarDay"
import type { Reminder } from "@/reminderTypes"

const noReminders: readonly Reminder[] = []

describe("calendar day interactions", () => {
  it("opens the matching daily agenda through the named day control", () => {
    const selectedDate = new Date(2026, 6, 15, 12)
    const onOpenAgenda = vi.fn()

    render(
      <CalendarDay
        actualToday={selectedDate}
        onActive={() => undefined}
        onOpenAgenda={onOpenAgenda}
        reminders={noReminders}
        selectedDate={selectedDate}
        showHours={false}
        tabIndex={0}
        visibleMonth={selectedDate}
      />,
    )

    fireEvent.click(
      screen.getByRole("button", { name: "Wednesday July 15, 2026" }),
    )

    expect(onOpenAgenda).toHaveBeenCalledWith(selectedDate)
  })

  it("defines hover and focus disclosure for icon-only reminder details", () => {
    const actualToday = new Date(2026, 6, 14, 12)
    const selectedDate = new Date(2026, 6, 15, 12)
    render(
      <CalendarDay
        actualToday={actualToday}
        onActive={() => undefined}
        onOpenAgenda={() => undefined}
        reminders={[
          {
            id: "keyboard-review",
            dateISOString: "2026-07-15T09:00:00.000Z",
            color: "DodgerBlue",
            text: "Keyboard review",
          },
        ]}
        selectedDate={selectedDate}
        showHours={false}
        tabIndex={0}
        visibleMonth={selectedDate}
      />,
    )

    const calendarDay = screen.getByRole("button", {
      name: "Wednesday July 15, 2026, 1 reminder",
    })
    const reminderDetails = screen.getByText(/Keyboard review/)

    expect(reminderDetails).toHaveClass("sr-only")
    expect(reminderDetails).toHaveClass("group-hover:not-sr-only")
    expect(reminderDetails).toHaveClass("group-focus:not-sr-only")
    expect(calendarDay).toHaveClass("group")
  })

  it("defines hover and focus emphasis for the current date", () => {
    const selectedDate = new Date(2026, 6, 15, 12)

    render(
      <CalendarDay
        actualToday={selectedDate}
        onActive={() => undefined}
        onOpenAgenda={() => undefined}
        reminders={noReminders}
        selectedDate={selectedDate}
        showHours={false}
        tabIndex={0}
        visibleMonth={selectedDate}
      />,
    )

    const calendarDay = screen.getByRole("button", {
      name: "Wednesday July 15, 2026",
    })
    const dateBadge = screen.getByText("15")

    expect(dateBadge).toHaveClass("bg-purple-700")
    expect(dateBadge).toHaveClass("group-hover:bg-purple-800")
    expect(dateBadge).toHaveClass("group-focus:bg-purple-800")
    expect(calendarDay).toHaveClass("group")
  })

  it("calls the active-date callback on focus and click", () => {
    const onActive = vi.fn()
    const selectedDate = new Date(2026, 6, 15, 12)

    render(
      <CalendarDay
        actualToday={selectedDate}
        onActive={onActive}
        onOpenAgenda={() => undefined}
        reminders={noReminders}
        selectedDate={selectedDate}
        showHours={false}
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

    render(
      <CalendarDay
        actualToday={selectedDate}
        onActive={() => undefined}
        onOpenAgenda={() => undefined}
        onKeyDown={onKeyDown}
        reminders={noReminders}
        selectedDate={selectedDate}
        showHours={false}
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
    render(
      <CalendarDay
        actualToday={selectedDate}
        onActive={() => undefined}
        onOpenAgenda={() => undefined}
        reminders={[
          {
            id: "hour-view",
            dateISOString: "2026-07-15T09:00:00.000Z",
            color: "DodgerBlue",
            text: "Hour view reminder",
          },
        ]}
        selectedDate={selectedDate}
        showHours={true}
        tabIndex={0}
        visibleMonth={selectedDate}
      />,
    )

    expect(screen.getByText(/Hour view reminder/)).not.toHaveClass("sr-only")
  })
})
