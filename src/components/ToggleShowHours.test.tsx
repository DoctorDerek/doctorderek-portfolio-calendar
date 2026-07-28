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

    const toggleThumb = showHoursButton.querySelector("div")
    expect(showHoursButton).toHaveClass("transition-colors", "duration-200")
    expect(toggleThumb).toHaveClass(
      "transition-transform",
      "duration-200",
      "ease-out",
      "translate-x-14",
    )

    fireEvent.click(showHoursButton)

    expect(
      screen.getByRole("button", {
        name: "Show reminder icons on the calendar",
      }),
    ).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByText("Hours")).toBeInTheDocument()
    expect(toggleThumb).toHaveClass("translate-x-0")

    fireEvent.click(
      screen.getByRole("button", {
        name: "Show reminder icons on the calendar",
      }),
    )

    expect(
      screen.getByRole("button", {
        name: "Show reminder hours on the calendar",
      }),
    ).toHaveAttribute("aria-pressed", "false")
    expect(screen.getByText("Icons")).toBeInTheDocument()
    expect(toggleThumb).toHaveClass("translate-x-14")
  })
})
