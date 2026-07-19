import { describe, expect, it } from "vitest"
import addReminderReducer, {
  openAddReminder,
} from "@/redux/addReminderSlice"

describe("add reminder state", () => {
  it("opens with the date requested by the initiating control", () => {
    const requestedDateISOString = "2026-07-15T12:00:00.000Z"

    expect(
      addReminderReducer(undefined, openAddReminder(requestedDateISOString)),
    ).toEqual({
      addReminderIsOpen: true,
      dateISOString: requestedDateISOString,
    })
  })
})
