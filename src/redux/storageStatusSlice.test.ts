import { describe, expect, it } from "vitest"
import storageStatus, {
  storageFailureReported,
  storageRecovered,
} from "@/redux/storageStatusSlice"

describe("storage status domains", () => {
  it("recovers one persistence domain without clearing another failure", () => {
    const reminderFailureState = storageStatus(
      undefined,
      storageFailureReported({
        domain: "reminders",
        message: "Reminder storage failed",
      }),
    )
    const bothFailuresState = storageStatus(
      reminderFailureState,
      storageFailureReported({
        domain: "displayPreference",
        message: "Display preference storage failed",
      }),
    )

    expect(
      storageStatus(bothFailuresState, storageRecovered("displayPreference")),
    ).toEqual({
      failureMessages: { reminders: "Reminder storage failed" },
    })
  })
})

