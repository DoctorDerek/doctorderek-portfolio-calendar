import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import App from "@/components/App"
import { renderWithProviders } from "@/test/renderWithProviders"

describe("reminder dialog interactions", () => {
  it("opens and closes through the named application controls", async () => {
    renderWithProviders(<App />)

    fireEvent.click(screen.getByRole("button", { name: "Add Reminder" }))

    expect(
      screen.getByRole("dialog", { name: "Add Reminder" }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Close Add Reminder" }))

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Add Reminder" }),
      ).not.toBeInTheDocument()
    })
  })

  it("cancels typed reminder text without adding it to the calendar", async () => {
    renderWithProviders(<App />)

    fireEvent.click(screen.getByRole("button", { name: "Add Reminder" }))
    fireEvent.change(screen.getByRole("textbox", { name: "Reminder" }), {
      target: { value: "Cancelled reminder" },
    })
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }))

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Add Reminder" }),
      ).not.toBeInTheDocument()
    })
    expect(screen.queryByText("Cancelled reminder")).not.toBeInTheDocument()
  })
})
