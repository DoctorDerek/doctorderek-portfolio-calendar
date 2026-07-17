import { afterEach, describe, expect, it, vi } from "vitest"
import remindersReducer, {
  addNewReminder,
  deleteReminder,
} from "@/redux/remindersSlice"
import type { Reminder } from "@/reminderTypes"

describe("reminder state transitions", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("orders new reminders chronologically and deletes the selected reminder", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.2)
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.4)

    const laterReminder: Reminder = {
      id: "pending-later-reminder",
      dateISOString: "2026-07-15T15:00:00.000Z",
      color: "SlateBlue",
      text: "Later reminder",
    }
    const earlierReminder: Reminder = {
      id: "pending-earlier-reminder",
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
    expect(state.reminders.map(({ id }) => id)).not.toContain(
      "pending-earlier-reminder",
    )
    expect(state.reminders.map(({ id }) => id)).not.toContain(
      "pending-later-reminder",
    )

    const earlierReminderId = state.reminders[0].id
    state = remindersReducer(state, deleteReminder(earlierReminderId))

    expect(state.reminders).toEqual([
      expect.objectContaining({ text: "Later reminder" }),
    ])
  })
})
