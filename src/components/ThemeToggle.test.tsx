import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import ThemeToggle from "@/components/ThemeToggle"

describe("theme toggle presentation", () => {
  it("presents and activates the light-theme control state", () => {
    const onToggle = vi.fn()
    render(<ThemeToggle isDarkTheme={false} onToggle={onToggle} />)

    const themeToggle = screen.getByRole("button", {
      name: "Switch to dark theme",
    })
    expect(themeToggle).toHaveClass("theme-toggle--light")

    fireEvent.click(themeToggle)

    expect(onToggle).toHaveBeenCalledOnce()
  })

  it("presents the dark-theme control state", () => {
    render(<ThemeToggle isDarkTheme={true} onToggle={() => undefined} />)

    expect(
      screen.getByRole("button", { name: "Switch to light theme" }),
    ).toHaveClass("theme-toggle--dark")
  })
})

