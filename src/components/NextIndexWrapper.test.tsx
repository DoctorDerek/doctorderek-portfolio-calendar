import { useTheme as useMaterialTheme } from "@mui/material/styles"
import { render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { renderToString } from "react-dom/server"
import { beforeEach, describe, expect, it, vi } from "vitest"
import NextIndexWrapper, {
  MaterialUIWrapper,
} from "@/components/NextIndexWrapper"
import { DISPLAY_PREFERENCE_STORAGE_KEY } from "@/redux/displayPreferenceStorage"

const nextThemeState = vi.hoisted(() => ({ resolvedTheme: "light" }))

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => children,
  useTheme: () => nextThemeState,
}))

function MaterialThemeMode() {
  const materialTheme = useMaterialTheme()
  return (
    <output aria-label="Material theme mode">
      {materialTheme.palette.mode}
    </output>
  )
}

describe("Material UI color scheme", () => {
  beforeEach(() => {
    localStorage.clear()
    nextThemeState.resolvedTheme = "light"
  })

  it("follows light and dark preferences from the application theme", () => {
    const { rerender } = render(
      <MaterialUIWrapper>
        <MaterialThemeMode />
      </MaterialUIWrapper>,
    )

    expect(
      screen.getByRole("status", { name: "Material theme mode" }),
    ).toHaveTextContent("light")

    nextThemeState.resolvedTheme = "dark"
    rerender(
      <MaterialUIWrapper>
        <MaterialThemeMode />
      </MaterialUIWrapper>,
    )

    expect(
      screen.getByRole("status", { name: "Material theme mode" }),
    ).toHaveTextContent("dark")
  })

  it("composes the themed Redux application shell", () => {
    render(<NextIndexWrapper />)

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole("region", { name: "Calendar" })).toBeInTheDocument()
  })

  it("server-renders deterministic calendar state before browser persistence", () => {
    localStorage.setItem(
      DISPLAY_PREFERENCE_STORAGE_KEY,
      JSON.stringify({ version: 1, showHours: true }),
    )

    const serverMarkup = renderToString(
      <NextIndexWrapper initialCurrentDateKey="2026-07-15" />,
    )
    const serverContainer = document.createElement("div")
    serverContainer.innerHTML = serverMarkup

    expect(
      serverContainer.querySelector("#calendar-month-heading"),
    ).toHaveTextContent("July 2026")
    expect(
      serverContainer.querySelector(
        '[aria-label="Show reminder hours on the calendar"]',
      ),
    ).toHaveAttribute("aria-pressed", "false")
  })
})
