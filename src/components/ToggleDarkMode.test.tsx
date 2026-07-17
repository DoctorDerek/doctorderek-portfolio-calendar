import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ToggleDarkMode from "@/components/ToggleDarkMode"

const themeState = vi.hoisted(() => ({
  resolvedTheme: "light",
  setTheme: vi.fn(),
}))

vi.mock("next-themes", () => ({
  useTheme: () => themeState,
}))

describe("theme toggle interactions", () => {
  beforeEach(() => {
    themeState.resolvedTheme = "light"
    themeState.setTheme.mockReset()
  })

  it("requests the dark theme from the light-theme control", async () => {
    render(<ToggleDarkMode />)

    fireEvent.click(
      await screen.findByRole("button", { name: "Switch to dark theme" }),
    )

    expect(themeState.setTheme).toHaveBeenCalledWith("dark")
  })

  it("requests the light theme from the dark-theme control", async () => {
    themeState.resolvedTheme = "dark"
    render(<ToggleDarkMode />)

    fireEvent.click(
      await screen.findByRole("button", { name: "Switch to light theme" }),
    )

    expect(themeState.setTheme).toHaveBeenCalledWith("light")
  })
})
