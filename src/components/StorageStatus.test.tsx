import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import StorageStatus from "@/components/StorageStatus"
import {
  DISPLAY_PREFERENCE_SAVE_FAILURE_MESSAGE,
  REMINDER_SAVE_FAILURE_MESSAGE,
} from "@/redux/storageStatusSlice"
import { rootReducer } from "@/redux/store"
import { renderWithProviders } from "@/test/renderWithProviders"

describe("storage status messaging", () => {
  it("surfaces all active persistence failures in one announcement", () => {
    const baselineState = rootReducer(undefined, { type: "test/initialize" })

    renderWithProviders(<StorageStatus />, {
      ...baselineState,
      storageStatus: {
        failureMessages: {
          reminders: REMINDER_SAVE_FAILURE_MESSAGE,
          displayPreference: DISPLAY_PREFERENCE_SAVE_FAILURE_MESSAGE,
        },
      },
    })

    const statusElement = screen.getByRole("status")

    expect(statusElement).toHaveTextContent(REMINDER_SAVE_FAILURE_MESSAGE)
    expect(statusElement).toHaveTextContent(
      DISPLAY_PREFERENCE_SAVE_FAILURE_MESSAGE,
    )
  })
})
