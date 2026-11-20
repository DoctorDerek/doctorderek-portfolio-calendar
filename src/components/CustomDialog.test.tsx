import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import CustomDialog from "@/components/CustomDialog"

describe("calendar modal", () => {
  it("dismisses backdrop taps and keeps interactions inside the panel open", () => {
    const close = vi.fn()
    const content = (open: boolean) => (
      <CustomDialog title="Agenda" open={open} onClose={close}>
        <p>Inside</p>
      </CustomDialog>
    )
    const { rerender } = render(content(false))
    expect(screen.queryByRole("dialog")).toBeNull()
    rerender(content(true))
    const dialog = screen.getByRole("dialog", { name: "Agenda" })
    fireEvent.click(screen.getByText("Inside"))
    expect(close).not.toHaveBeenCalled()
    fireEvent.click(dialog)
    expect(close).toHaveBeenCalledOnce()
    rerender(content(false))
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})
