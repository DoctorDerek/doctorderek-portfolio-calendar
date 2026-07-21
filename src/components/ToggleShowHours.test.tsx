import { fireEvent, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import ToggleShowHours from "@/components/ToggleShowHours"
import { renderWithProviders } from "@/test/renderWithProviders"

const reducedMotionState = vi.hoisted(() => ({ enabled: false }))

vi.mock("motion/react", async (importOriginal) => {
  const motionModule = await importOriginal<typeof import("motion/react")>()
  return {
    ...motionModule,
    useReducedMotion: () => reducedMotionState.enabled,
  }
})

describe("calendar reminder display toggle", () => {
  beforeEach(() => {
    reducedMotionState.enabled = false
  })

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
  })

  it("remains operable when reduced motion is preferred", () => {
    reducedMotionState.enabled = true
    renderWithProviders(<ToggleShowHours />)

    fireEvent.click(
      screen.getByRole("button", {
        name: "Show reminder hours on the calendar",
      }),
    )

    expect(screen.getByText("Hours")).toBeInTheDocument()
  })
})
