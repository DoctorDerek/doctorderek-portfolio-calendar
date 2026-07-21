import { useTheme as useMaterialTheme } from "@mui/material/styles"
import { render, screen } from "@testing-library/react"
import type { ReactNode } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import NextIndexWrapper, {
  MaterialUIWrapper,
} from "@/components/NextIndexWrapper"

const nextThemeState = vi.hoisted(() => ({ resolvedTheme: "light" }))

vi.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: ReactNode }) => children,
  useTheme: () => nextThemeState,
}))

function MaterialThemeMode() {
  const materialTheme = useMaterialTheme()
  return <output aria-label="Material theme mode">{materialTheme.palette.mode}</output>
}

describe("Material UI color scheme", () => {
  beforeEach(() => {
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
    expect(
      screen.getByRole("region", { name: "Calendar" }),
    ).toBeInTheDocument()
  })
})
