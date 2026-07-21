import { fireEvent, screen, within } from "@testing-library/react"
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
  showHours: { showHours: false },
}

describe("agenda reminder interactions", () => {
  it("presents the selected day reminder and deletes it through the UI", () => {
    renderWithProviders(<AgendaDay />, preloadedAgendaState)

    expect(
      screen.getByRole("dialog", { name: "Agenda: July 15, 2026" }),
    ).toBeInTheDocument()
    const reminderList = screen.getByRole("list", {
      name: "Reminders for July 15, 2026",
    })
    expect(within(reminderList).getAllByRole("listitem")).toHaveLength(1)
    expect(within(reminderList).getByText("9:00 AM")).toBeInTheDocument()
    expect(
      within(reminderList).getByText("Portfolio review"),
    ).toBeInTheDocument()

    const deleteReminderButton = screen.getByRole("button", {
      name: "Delete reminder 9:00 AM Portfolio review",
    })
    fireEvent.click(deleteReminderButton)

    expect(
      screen.queryByRole("list", { name: "Reminders for July 15, 2026" }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("No reminders yet.")
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

  it("presents reminders in chronological list order", () => {
    const chronologicalAgendaState: RootState = {
      ...preloadedAgendaState,
      reminders: {
        reminders: [
          ...preloadedAgendaState.reminders.reminders,
          {
            id: "architecture-review",
            dateISOString: "2026-07-15T13:30:00",
            color: "Tomato",
            text: "Architecture review",
          },
        ],
      },
    }
    renderWithProviders(<AgendaDay />, chronologicalAgendaState)

    const reminderItems = within(
      screen.getByRole("list", { name: "Reminders for July 15, 2026" }),
    ).getAllByRole("listitem")

    expect(reminderItems).toHaveLength(2)
    expect(reminderItems[0]).toHaveTextContent("9:00 AMPortfolio review")
    expect(reminderItems[1]).toHaveTextContent("1:30 PMArchitecture review")
  })
})
