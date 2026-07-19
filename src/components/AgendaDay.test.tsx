import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import AgendaDay from "@/components/AgendaDay"
import type { RootState } from "@/redux/store"
import { renderWithProviders } from "@/test/renderWithProviders"

const selectedAgendaDateISOString = "2026-07-15T12:00:00"
const preloadedAgendaState: RootState = {
  addReminder: { addReminderIsOpen: false, dateISOString: "" },
  agenda: {
    agendaIsOpen: true,
    dateISOString: selectedAgendaDateISOString,
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

describe("agenda reminder interactions", () => {
  it("presents the selected day reminder and deletes it through the UI", () => {
    renderWithProviders(<AgendaDay />, preloadedAgendaState)

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

  it("requests the visible agenda date when opening the reminder form", () => {
    const { store } = renderWithProviders(<AgendaDay />, preloadedAgendaState)

    fireEvent.click(
      screen.getByRole("button", {
        name: "Add Reminder for July 15, 2026",
      }),
    )

    expect(store.getState().addReminder).toEqual({
      addReminderIsOpen: true,
      dateISOString: new Date(selectedAgendaDateISOString).toISOString(),
    })
  })
})
