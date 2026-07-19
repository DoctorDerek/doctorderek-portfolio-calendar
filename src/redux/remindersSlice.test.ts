import { describe, expect, it } from "vitest"
import remindersReducer, {
  addNewReminder,
  deleteReminder,
} from "@/redux/remindersSlice"
import type { NewReminder } from "@/reminderTypes"

describe("reminder state transitions", () => {
  it("orders new reminders chronologically and deletes the selected reminder", () => {
    const laterReminder: NewReminder = {
      dateISOString: "2026-07-15T15:00:00.000Z",
      color: "SlateBlue",
      text: "Later reminder",
    }
    const earlierReminder: NewReminder = {
      dateISOString: "2026-07-15T09:00:00.000Z",
      color: "MediumSeaGreen",
      text: "Earlier reminder",
    }

    let state = remindersReducer(undefined, addNewReminder(laterReminder))
    state = remindersReducer(state, addNewReminder(earlierReminder))

    expect(state.reminders.map(({ text }) => text)).toEqual([
      "Earlier reminder",
      "Later reminder",
    ])

    const earlierReminderId = state.reminders[0].id
    state = remindersReducer(state, deleteReminder(earlierReminderId))

    expect(state.reminders).toEqual([
      expect.objectContaining({ text: "Later reminder" }),
    ])
  })
})
