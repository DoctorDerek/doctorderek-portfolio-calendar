import { act, fireEvent, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import App from "@/components/App"
import { REMINDER_SAVE_FAILURE_MESSAGE } from "@/redux/storageStatusSlice"
import { rootReducer } from "@/redux/store"
import { renderWithProviders } from "@/test/renderWithProviders"
import { formatCalendarDayAccessibleName } from "@/utils/dateUtils"

describe("calendar month navigation", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("moves between adjacent months through the calendar controls", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 15, 12))

    renderWithProviders(<App />)

    expect(screen.getByText("July 2026")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Next Month" }))

    expect(screen.getByText("August 2026")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Previous Month" }))
    fireEvent.click(screen.getByRole("button", { name: "Previous Month" }))

    expect(screen.getByText("June 2026")).toBeInTheDocument()
  })

  it("exposes weekday headers and six weeks through calendar grid semantics", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 15, 12))

    renderWithProviders(<App />)

    const calendarGrid = screen.getByRole("grid", { name: "July 2026" })
    expect(within(calendarGrid).getAllByRole("columnheader")).toHaveLength(7)
    expect(within(calendarGrid).getAllByRole("row")).toHaveLength(7)
    expect(within(calendarGrid).getAllByRole("gridcell")).toHaveLength(42)
  })

  it("keeps one active date in the tab order across month changes", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 31, 12))

    renderWithProviders(<App />)

    const januaryGrid = screen.getByRole("grid", { name: "January 2026" })
    expect(
      within(januaryGrid)
        .getAllByRole("button")
        .filter((button) => button.tabIndex === 0),
    ).toEqual([
      screen.getByRole("button", {
        name: formatCalendarDayAccessibleName(new Date(2026, 0, 31)),
      }),
    ])

    fireEvent.click(screen.getByRole("button", { name: "Next Month" }))

    const februaryGrid = screen.getByRole("grid", { name: "February 2026" })
    expect(
      within(februaryGrid)
        .getAllByRole("button")
        .filter((button) => button.tabIndex === 0),
    ).toEqual([
      screen.getByRole("button", {
        name: formatCalendarDayAccessibleName(new Date(2026, 1, 28)),
      }),
    ])
  })

  it("moves the active calendar date with grid navigation keys", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 15, 12))

    renderWithProviders(<App />)

    const julyFifteenth = screen.getByRole("button", {
      name: formatCalendarDayAccessibleName(new Date(2026, 6, 15)),
    })
    julyFifteenth.focus()

    fireEvent.keyDown(julyFifteenth, { key: "ArrowRight" })
    expect(
      screen.getByRole("button", {
        name: formatCalendarDayAccessibleName(new Date(2026, 6, 16)),
      }),
    ).toHaveFocus()

    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: "ArrowDown",
    })
    expect(
      screen.getByRole("button", {
        name: formatCalendarDayAccessibleName(new Date(2026, 6, 23)),
      }),
    ).toHaveFocus()

    fireEvent.keyDown(document.activeElement ?? document.body, { key: "Home" })
    expect(
      screen.getByRole("button", {
        name: formatCalendarDayAccessibleName(new Date(2026, 6, 19)),
      }),
    ).toHaveFocus()

    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: "End",
      ctrlKey: true,
    })
    expect(
      screen.getByRole("button", {
        name: formatCalendarDayAccessibleName(new Date(2026, 7, 8)),
      }),
    ).toHaveFocus()
  })

  it("moves the active calendar date with page and shifted page keys", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 31, 12))

    renderWithProviders(<App />)

    const januaryThirtyFirst = screen.getByRole("button", {
      name: formatCalendarDayAccessibleName(new Date(2026, 0, 31)),
    })
    januaryThirtyFirst.focus()

    fireEvent.keyDown(document.activeElement ?? document.body, { key: "PageDown" })
    expect(screen.getByText("February 2026")).toBeInTheDocument()
    expect(
      screen.getByRole("button", {
        name: formatCalendarDayAccessibleName(new Date(2026, 1, 28)),
      }),
    ).toHaveFocus()

    fireEvent.keyDown(document.activeElement ?? document.body, {
      key: "PageDown",
      shiftKey: true,
    })
    expect(screen.getByText("February 2027")).toBeInTheDocument()
    expect(
      screen.getByRole("button", {
        name: formatCalendarDayAccessibleName(new Date(2027, 1, 28)),
      }),
    ).toHaveFocus()
  })

  it("keeps today anchored to the real date while another month is visible", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 15, 12))

    renderWithProviders(<App />)

    expect(
      screen.getByRole("button", { name: "Wednesday July 15, 2026" }),
    ).toHaveAttribute("aria-current", "date")

    fireEvent.click(screen.getByRole("button", { name: "Next Month" }))

    expect(
      screen.getByRole("button", { name: "Saturday August 15, 2026" }),
    ).not.toHaveAttribute("aria-current")

    fireEvent.click(screen.getByRole("button", { name: "Previous Month" }))

    expect(
      screen.getByRole("button", { name: "Wednesday July 15, 2026" }),
    ).toHaveAttribute("aria-current", "date")
  })

  it("moves today at the next local date boundary", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 31, 23, 59, 59))

    renderWithProviders(<App />)

    expect(
      screen.getByRole("button", { name: "Friday July 31, 2026" }),
    ).toHaveAttribute("aria-current", "date")

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(
      screen.getByRole("button", { name: "Saturday August 1, 2026" }),
    ).toHaveAttribute("aria-current", "date")
    expect(screen.getByText("July 2026")).toBeInTheDocument()
  })

  it("resynchronizes today when the page becomes visible or focused", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 15, 12))
    const visibilityState = vi
      .spyOn(document, "visibilityState", "get")
      .mockReturnValue("hidden")

    renderWithProviders(<App />)
    vi.setSystemTime(new Date(2026, 6, 16, 12))

    fireEvent(document, new Event("visibilitychange"))
    expect(
      screen.getByRole("button", { name: "Wednesday July 15, 2026" }),
    ).toHaveAttribute("aria-current", "date")

    visibilityState.mockReturnValue("visible")
    fireEvent(document, new Event("visibilitychange"))
    expect(
      screen.getByRole("button", { name: "Thursday July 16, 2026" }),
    ).toHaveAttribute("aria-current", "date")

    vi.setSystemTime(new Date(2026, 6, 17, 12))
    fireEvent.focus(window)
    expect(
      screen.getByRole("button", { name: "Friday July 17, 2026" }),
    ).toHaveAttribute("aria-current", "date")

    visibilityState.mockRestore()
  })

  it("announces reminder persistence failures without hiding calendar actions", () => {
    const initialState = rootReducer(undefined, { type: "test/initialize" })

    renderWithProviders(<App />, {
      ...initialState,
      storageStatus: {
        failureMessages: { reminders: REMINDER_SAVE_FAILURE_MESSAGE },
      },
    })

    expect(screen.getByRole("status")).toHaveTextContent(
      REMINDER_SAVE_FAILURE_MESSAGE,
    )
    expect(screen.getByRole("button", { name: "Add Reminder" })).toBeEnabled()
  })
})

