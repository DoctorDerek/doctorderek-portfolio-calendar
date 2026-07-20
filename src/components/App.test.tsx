import { fireEvent, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import App from "@/components/App"
import { renderWithProviders } from "@/test/renderWithProviders"

describe("calendar month navigation", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("moves between adjacent months through the calendar controls", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 15, 12))

    renderWithProviders(<App />)

    expect(screen.getByText("July 2026")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Next Month" }))

    expect(screen.getByText("August 2026")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("button", { name: "Previous Month" }))
    fireEvent.click(screen.getByRole("button", { name: "Previous Month" }))

    expect(screen.getByText("June 2026")).toBeInTheDocument()
  })
})
