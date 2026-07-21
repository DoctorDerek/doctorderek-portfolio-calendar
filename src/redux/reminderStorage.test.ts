import { describe, expect, it, vi } from "vitest"
import {
  loadPersistedReminders,
  persistReminders,
  REMINDER_STORAGE_KEY,
  type ReminderStorage,
} from "@/redux/reminderStorage"
import { addNewReminder, deleteReminder } from "@/redux/remindersSlice"
import { showHoursOnCalendar } from "@/redux/showHoursSlice"
import { createCalendarStore } from "@/redux/store"
import type { Reminder } from "@/reminderTypes"

const persistedReminder: Reminder = {
  id: "portfolio-review",
  dateISOString: "2026-07-15T09:00:00.000Z",
  color: "DodgerBlue",
  text: "Portfolio review",
}

const createMemoryReminderStorage = (initialValue: string | null = null) => {
  let storedValue = initialValue
  const reminderStorage: ReminderStorage = {
    getItem: vi.fn(() => storedValue),
    setItem: vi.fn((_key, value) => {
      storedValue = value
    }),
  }
  return reminderStorage
}

describe("reminder persistence", () => {
  it("round-trips validated reminder data through the versioned storage key", () => {
    const reminderStorage = createMemoryReminderStorage()

    expect(persistReminders([persistedReminder], reminderStorage)).toBe(true)
    expect(reminderStorage.setItem).toHaveBeenCalledWith(
      REMINDER_STORAGE_KEY,
      expect.any(String),
    )
    expect(loadPersistedReminders(reminderStorage)).toEqual([
      persistedReminder,
    ])
  })

  it.each([
    ["malformed JSON", "not-json"],
    ["a null storage payload", JSON.stringify(null)],
    ["a primitive storage payload", JSON.stringify("invalid")],
    [
      "an unsupported version",
      JSON.stringify({ version: 2, reminders: [persistedReminder] }),
    ],
    [
      "invalid reminder fields",
      JSON.stringify({
        version: 1,
        reminders: [{ ...persistedReminder, color: "Chartreuse" }],
      }),
    ],
    [
      "a null reminder",
      JSON.stringify({ version: 1, reminders: [null] }),
    ],
    [
      "a primitive reminder",
      JSON.stringify({ version: 1, reminders: [42] }),
    ],
    [
      "duplicate reminder identities",
      JSON.stringify({
        version: 1,
        reminders: [persistedReminder, persistedReminder],
      }),
    ],
  ])("rejects %s", (_scenario, storedValue) => {
    expect(
      loadPersistedReminders(createMemoryReminderStorage(storedValue)),
    ).toEqual([])
  })

  it("recovers when browser storage cannot be read or written", () => {
    const unavailableReminderStorage: ReminderStorage = {
      getItem: vi.fn(() => {
        throw new Error("Storage is unavailable")
      }),
      setItem: vi.fn(() => {
        throw new Error("Storage is unavailable")
      }),
    }

    expect(loadPersistedReminders(unavailableReminderStorage)).toEqual([])
    expect(
      persistReminders([persistedReminder], unavailableReminderStorage),
    ).toBe(false)
  })

  it("does nothing when browser globals are unavailable", () => {
    vi.stubGlobal("window", undefined)

    try {
      expect(loadPersistedReminders()).toEqual([])
      expect(persistReminders([persistedReminder])).toBe(false)
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it("recovers when the browser blocks local storage access", () => {
    const localStorageGetter = vi
      .spyOn(window, "localStorage", "get")
      .mockImplementation(() => {
        throw new Error("Storage access is blocked")
      })

    try {
      expect(loadPersistedReminders()).toEqual([])
      expect(persistReminders([persistedReminder])).toBe(false)
    } finally {
      localStorageGetter.mockRestore()
    }
  })

  it("hydrates additions and deletions across calendar store sessions", () => {
    const reminderStorage = createMemoryReminderStorage()
    const firstCalendarStore = createCalendarStore({ reminderStorage })

    firstCalendarStore.dispatch(
      addNewReminder({
        dateISOString: persistedReminder.dateISOString,
        color: persistedReminder.color,
        text: persistedReminder.text,
      }),
    )

    const rehydratedCalendarStore = createCalendarStore({ reminderStorage })
    expect(rehydratedCalendarStore.getState().reminders.reminders).toEqual([
      expect.objectContaining({ text: persistedReminder.text }),
    ])

    const reminderId =
      rehydratedCalendarStore.getState().reminders.reminders[0].id
    rehydratedCalendarStore.dispatch(deleteReminder(reminderId))

    expect(
      createCalendarStore({ reminderStorage }).getState().reminders.reminders,
    ).toEqual([])
  })

  it("does not rewrite reminders for unrelated state transitions", () => {
    const reminderStorage = createMemoryReminderStorage()
    const calendarStore = createCalendarStore({ reminderStorage })

    calendarStore.dispatch(showHoursOnCalendar())

    expect(reminderStorage.setItem).not.toHaveBeenCalled()
  })
})
