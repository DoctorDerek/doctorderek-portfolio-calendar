import { describe, expect, it, vi } from "vitest"
import type { CalendarStorage } from "@/redux/calendarStorage"
import { DISPLAY_PREFERENCE_STORAGE_KEY } from "@/redux/displayPreferenceStorage"
import { addNewReminder, deleteReminder } from "@/redux/remindersSlice"
import {
  loadPersistedReminders,
  persistReminders,
  REMINDER_STORAGE_KEY,
} from "@/redux/reminderStorage"
import { showHoursOnCalendar } from "@/redux/showHoursSlice"
import {
  REMINDER_LOAD_FAILURE_MESSAGE,
  REMINDER_SAVE_FAILURE_MESSAGE,
} from "@/redux/storageStatusSlice"
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
  const reminderStorage: CalendarStorage = {
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

    expect(persistReminders([persistedReminder], reminderStorage)).toEqual({
      status: "success",
    })
    expect(reminderStorage.setItem).toHaveBeenCalledWith(
      REMINDER_STORAGE_KEY,
      expect.any(String),
    )
    expect(loadPersistedReminders(reminderStorage)).toEqual({
      status: "success",
      reminders: [persistedReminder],
    })
  })

  it("hydrates validated reminders in chronological order", () => {
    const earlierReminder = {
      ...persistedReminder,
      id: "planning-session",
      dateISOString: "2026-07-14T18:00:00.000Z",
      text: "Planning session",
    }
    const reminderStorage = createMemoryReminderStorage(
      JSON.stringify({
        version: 1,
        reminders: [persistedReminder, earlierReminder],
      }),
    )

    expect(loadPersistedReminders(reminderStorage)).toEqual({
      status: "success",
      reminders: [earlierReminder, persistedReminder],
    })
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
      "a noncanonical reminder timestamp",
      JSON.stringify({
        version: 1,
        reminders: [
          { ...persistedReminder, dateISOString: "2026-07-15T09:00:00Z" },
        ],
      }),
    ],
    [
      "a non-string reminder timestamp",
      JSON.stringify({
        version: 1,
        reminders: [{ ...persistedReminder, dateISOString: 42 }],
      }),
    ],
    [
      "an invalid reminder timestamp",
      JSON.stringify({
        version: 1,
        reminders: [{ ...persistedReminder, dateISOString: "not-a-date" }],
      }),
    ],
    ["a null reminder", JSON.stringify({ version: 1, reminders: [null] })],
    ["a primitive reminder", JSON.stringify({ version: 1, reminders: [42] })],
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
    ).toEqual({
      status: "failure",
      errorMessage: expect.any(String),
    })
  })

  it("recovers when browser storage cannot be read or written", () => {
    const unavailableReminderStorage: CalendarStorage = {
      getItem: vi.fn(() => {
        throw new Error("Storage is unavailable")
      }),
      setItem: vi.fn(() => {
        throw new Error("Storage is unavailable")
      }),
    }

    expect(loadPersistedReminders(unavailableReminderStorage)).toEqual({
      status: "failure",
      errorMessage: "Storage is unavailable",
    })
    expect(
      persistReminders([persistedReminder], unavailableReminderStorage),
    ).toEqual({
      status: "failure",
      errorMessage: "Storage is unavailable",
    })

    const calendarStore = createCalendarStore({
      calendarStorage: unavailableReminderStorage,
    })
    expect(
      calendarStore.getState().storageStatus.failureMessages.reminders,
    ).toBe(REMINDER_LOAD_FAILURE_MESSAGE)

    calendarStore.dispatch(
      addNewReminder({
        dateISOString: persistedReminder.dateISOString,
        color: persistedReminder.color,
        text: persistedReminder.text,
      }),
    )
    expect(
      calendarStore.getState().storageStatus.failureMessages.reminders,
    ).toBe(REMINDER_SAVE_FAILURE_MESSAGE)
  })

  it("clears a hydration failure after reminders save successfully", () => {
    const reminderStorage = createMemoryReminderStorage("invalid")
    const calendarStore = createCalendarStore({
      calendarStorage: reminderStorage,
    })

    expect(
      calendarStore.getState().storageStatus.failureMessages.reminders,
    ).toBe(REMINDER_LOAD_FAILURE_MESSAGE)

    calendarStore.dispatch(
      addNewReminder({
        dateISOString: persistedReminder.dateISOString,
        color: persistedReminder.color,
        text: persistedReminder.text,
      }),
    )

    expect(
      calendarStore.getState().storageStatus.failureMessages.reminders,
    ).toBeUndefined()
  })

  it("does nothing when browser globals are unavailable", () => {
    vi.stubGlobal("window", undefined)

    try {
      expect(loadPersistedReminders()).toEqual({
        status: "failure",
        errorMessage: "Browser storage is unavailable",
      })
      expect(persistReminders([persistedReminder])).toEqual({
        status: "failure",
        errorMessage: "Browser storage is unavailable",
      })
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
      expect(loadPersistedReminders()).toEqual({
        status: "failure",
        errorMessage: "Storage access is blocked",
      })
      expect(persistReminders([persistedReminder])).toEqual({
        status: "failure",
        errorMessage: "Storage access is blocked",
      })
    } finally {
      localStorageGetter.mockRestore()
    }
  })

  it("hydrates additions and deletions across calendar store sessions", () => {
    const reminderStorage = createMemoryReminderStorage()
    const firstCalendarStore = createCalendarStore({
      calendarStorage: reminderStorage,
    })

    firstCalendarStore.dispatch(
      addNewReminder({
        dateISOString: persistedReminder.dateISOString,
        color: persistedReminder.color,
        text: persistedReminder.text,
      }),
    )

    const rehydratedCalendarStore = createCalendarStore({
      calendarStorage: reminderStorage,
    })
    expect(rehydratedCalendarStore.getState().reminders.reminders).toEqual([
      expect.objectContaining({ text: persistedReminder.text }),
    ])

    const reminderId =
      rehydratedCalendarStore.getState().reminders.reminders[0].id
    rehydratedCalendarStore.dispatch(deleteReminder(reminderId))

    expect(
      createCalendarStore({ calendarStorage: reminderStorage }).getState()
        .reminders.reminders,
    ).toEqual([])
  })

  it("does not rewrite reminders for display preference transitions", () => {
    const reminderStorage = createMemoryReminderStorage()
    const calendarStore = createCalendarStore({
      calendarStorage: reminderStorage,
    })

    calendarStore.dispatch(showHoursOnCalendar())

    expect(reminderStorage.setItem).toHaveBeenCalledWith(
      DISPLAY_PREFERENCE_STORAGE_KEY,
      expect.any(String),
    )
    expect(reminderStorage.setItem).not.toHaveBeenCalledWith(
      REMINDER_STORAGE_KEY,
      expect.any(String),
    )
  })
})

