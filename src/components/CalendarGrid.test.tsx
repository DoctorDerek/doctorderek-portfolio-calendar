import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import CalendarGrid from "@/components/CalendarGrid"
import { renderWithProviders } from "@/test/renderWithProviders"

describe("calendar grid keyboard navigation", () => {
  it("moves focus to the end of the week with the End key", () => {
    const onActiveDateChange = vi.fn()
    const onVisibleMonthChange = vi.fn()
    const visibleMonth = new Date(2026, 6, 1)
    const activeDate = new Date(2026, 6, 15, 12)

    renderWithProviders(
      <CalendarGrid
        actualToday={activeDate}
        activeDate={activeDate}
        onActiveDateChange={onActiveDateChange}
        onVisibleMonthChange={onVisibleMonthChange}
        visibleMonth={visibleMonth}
      />,
    )

    const activeButton = screen.getByRole("button", {
      name: "Wednesday July 15, 2026",
    })
    const weekEndButton = screen.getByRole("button", {
      name: "Saturday July 18, 2026",
    })

    const initialCallCount = onActiveDateChange.mock.calls.length

    fireEvent.focus(activeButton)
    fireEvent.keyDown(activeButton, { key: "End" })

    expect(onVisibleMonthChange).not.toHaveBeenCalled()
    const finalCallCount = onActiveDateChange.mock.calls.length
    expect(finalCallCount).toBeGreaterThan(initialCallCount + 1)
    const [nextDate] = onActiveDateChange.mock.calls[finalCallCount - 1] as [Date]
    expect(nextDate.getFullYear()).toBe(2026)
    expect(nextDate.getMonth()).toBe(6)
    expect(nextDate.getDate()).toBe(18)
    const [focusedDate] = onActiveDateChange.mock.calls[finalCallCount - 2] as [
      Date,
    ]
    expect(focusedDate.getFullYear()).toBe(2026)
    expect(focusedDate.getMonth()).toBe(6)
    expect(focusedDate.getDate()).toBe(18)
    expect(weekEndButton).toHaveFocus()
  })

  it("ignores unsupported keys without changing selection", () => {
    const onActiveDateChange = vi.fn()
    const onVisibleMonthChange = vi.fn()
    const visibleMonth = new Date(2026, 6, 1)
    const activeDate = new Date(2026, 6, 15, 12)

    renderWithProviders(
      <CalendarGrid
        actualToday={activeDate}
        activeDate={activeDate}
        onActiveDateChange={onActiveDateChange}
        onVisibleMonthChange={onVisibleMonthChange}
        visibleMonth={visibleMonth}
      />,
    )

    const activeButton = screen.getByRole("button", {
      name: "Wednesday July 15, 2026",
    })

    fireEvent.focus(activeButton)
    fireEvent.keyDown(activeButton, { key: "a" })

    const callCountAfterFocus = onActiveDateChange.mock.calls.length
    expect(onActiveDateChange).toHaveBeenCalledTimes(callCountAfterFocus)
    expect(onVisibleMonthChange).not.toHaveBeenCalled()
  })

  it("moves to the previous month with PageUp and keeps day alignment", () => {
    const onActiveDateChange = vi.fn()
    const onVisibleMonthChange = vi.fn()
    const visibleMonth = new Date(2026, 6, 1)
    const activeDate = new Date(2026, 6, 15, 12)

    renderWithProviders(
      <CalendarGrid
        actualToday={activeDate}
        activeDate={activeDate}
        onActiveDateChange={onActiveDateChange}
        onVisibleMonthChange={onVisibleMonthChange}
        visibleMonth={visibleMonth}
      />,
    )

    const activeButton = screen.getByRole("button", {
      name: "Wednesday July 15, 2026",
    })

    fireEvent.focus(activeButton)
    fireEvent.keyDown(activeButton, { key: "PageUp" })

    expect(onVisibleMonthChange).toHaveBeenCalledWith(new Date(2026, 5, 1))
    expect(onActiveDateChange).toHaveBeenCalledWith(new Date(2026, 5, 15))
  })

  it("moves to the next month with PageDown and keeps day alignment", () => {
    const onActiveDateChange = vi.fn()
    const onVisibleMonthChange = vi.fn()
    const visibleMonth = new Date(2026, 6, 1)
    const activeDate = new Date(2026, 6, 15, 12)

    renderWithProviders(
      <CalendarGrid
        actualToday={activeDate}
        activeDate={activeDate}
        onActiveDateChange={onActiveDateChange}
        onVisibleMonthChange={onVisibleMonthChange}
        visibleMonth={visibleMonth}
      />,
    )

    const activeButton = screen.getByRole("button", {
      name: "Wednesday July 15, 2026",
    })

    fireEvent.focus(activeButton)
    fireEvent.keyDown(activeButton, { key: "PageDown" })

    expect(onVisibleMonthChange).toHaveBeenCalledWith(new Date(2026, 7, 1))
    expect(onActiveDateChange).toHaveBeenCalledWith(new Date(2026, 7, 15))
  })

  it("moves one year forward with Shift+PageDown and keeps day alignment", () => {
    const onActiveDateChange = vi.fn()
    const onVisibleMonthChange = vi.fn()
    const visibleMonth = new Date(2026, 6, 1)
    const activeDate = new Date(2026, 6, 15, 12)

    renderWithProviders(
      <CalendarGrid
        actualToday={activeDate}
        activeDate={activeDate}
        onActiveDateChange={onActiveDateChange}
        onVisibleMonthChange={onVisibleMonthChange}
        visibleMonth={visibleMonth}
      />,
    )

    const activeButton = screen.getByRole("button", {
      name: "Wednesday July 15, 2026",
    })

    fireEvent.focus(activeButton)
    fireEvent.keyDown(activeButton, { key: "PageDown", shiftKey: true })

    expect(onVisibleMonthChange).toHaveBeenCalledWith(new Date(2027, 6, 1))
    expect(onActiveDateChange).toHaveBeenCalledWith(new Date(2027, 6, 15))
  })
})
