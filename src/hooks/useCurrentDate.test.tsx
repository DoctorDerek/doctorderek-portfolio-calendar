import { act } from "@testing-library/react"
import type { Root } from "react-dom/client"
import { hydrateRoot } from "react-dom/client"
import { renderToString } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useInitialCurrentDate } from "@/hooks/useCurrentDate"
import { formatCalendarDate } from "@/utils/dateUtils"

function InitialCurrentDate({
  initialCurrentDateKey,
}: {
  initialCurrentDateKey: string
}) {
  const initialCurrentDate = useInitialCurrentDate(initialCurrentDateKey)

  return <output>{formatCalendarDate(initialCurrentDate)}</output>
}

describe("initial calendar date hydration", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("hydrates the server date before adopting the browser-local date", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 6, 15, 12))

    const serverMarkup = renderToString(
      <InitialCurrentDate initialCurrentDateKey="2026-08-01" />,
    )
    expect(serverMarkup).toContain("August 1, 2026")

    const container = document.createElement("div")
    container.innerHTML = serverMarkup
    document.body.append(container)
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    let root: Root | undefined

    await act(async () => {
      root = hydrateRoot(
        container,
        <InitialCurrentDate initialCurrentDateKey="2026-08-01" />,
      )
    })

    expect(container).toHaveTextContent("July 15, 2026")
    expect(consoleError).not.toHaveBeenCalled()

    await act(async () => {
      root?.unmount()
    })
    consoleError.mockRestore()
    container.remove()
  })
})
