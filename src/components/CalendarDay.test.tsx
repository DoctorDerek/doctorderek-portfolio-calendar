import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import AgendaDay from "@/components/AgendaDay"
import CalendarDay from "@/components/CalendarDay"
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
})
