import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import AgendaDay from "@/components/AgendaDay"
import type { RootState } from "@/redux/store"
import { renderWithProviders } from "@/test/renderWithProviders"

describe("agenda reminder interactions", () => {
  it("presents the selected day reminder and deletes it through the UI", () => {
    const preloadedState: RootState = {
      addReminder: { addReminderIsOpen: false },
      agenda: {
        agendaIsOpen: true,
        dateISOString: "2026-07-15T12:00:00",
      },
      reminders: {
        reminders: [
          {
            id: "portfolio-review",
            dateISOString: "2026-07-15T09:00:00",
            color: "DodgerBlue",
            text: "Portfolio review",
          },
        ],
      },
      reset: {},
      showHours: { showHours: false },
    }

    renderWithProviders(<AgendaDay />, preloadedState)

    expect(
      screen.getByRole("dialog", { name: "Agenda: July 15, 2026" }),
    ).toBeInTheDocument()
    expect(screen.getAllByText("9:00 AM")).toHaveLength(2)
    expect(screen.getAllByText("Portfolio review")).toHaveLength(2)

    const deleteReminderButtons = screen.getAllByRole("button", {
      name: "Delete reminder 9:00 AM Portfolio review",
    })
    fireEvent.click(deleteReminderButtons[0])

    expect(screen.getByText("No reminders yet.")).toBeInTheDocument()
    expect(screen.queryByText("Portfolio review")).not.toBeInTheDocument()
  })
})
