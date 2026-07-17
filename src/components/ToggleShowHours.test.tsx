import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import ToggleShowHours from "@/components/ToggleShowHours"
import { renderWithProviders } from "@/test/renderWithProviders"

describe("calendar reminder display toggle", () => {
  it("switches between icon and hour presentation through one accessible button", () => {
    renderWithProviders(<ToggleShowHours />)

    const showHoursButton = screen.getByRole("button", {
      name: "Show reminder hours on the calendar",
    })

    expect(screen.getAllByRole("button")).toHaveLength(1)
    expect(showHoursButton).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByText("Icons")).toBeInTheDocument()

    fireEvent.click(showHoursButton)

    expect(
      screen.getByRole("button", {
        name: "Show reminder icons on the calendar",
      }),
    ).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("Hours")).toBeInTheDocument()
  })
})
