import { describe, expect, it, vi } from "vitest"
import type { CalendarStorage } from "@/redux/calendarStorage"
import {
  DISPLAY_PREFERENCE_STORAGE_KEY,
  loadDisplayPreference,
  persistDisplayPreference,
} from "@/redux/displayPreferenceStorage"
import { addNewReminder } from "@/redux/remindersSlice"
import {
  hideHoursOnCalendar,
  showHoursOnCalendar,
} from "@/redux/showHoursSlice"
import {
  DISPLAY_PREFERENCE_LOAD_FAILURE_MESSAGE,
  DISPLAY_PREFERENCE_SAVE_FAILURE_MESSAGE,
} from "@/redux/storageStatusSlice"
import { createCalendarStore } from "@/redux/store"

const createMemoryCalendarStorage = (initialValue: string | null = null) => {
  const storedValues = new Map<string, string>()
  if (initialValue) {
    storedValues.set(DISPLAY_PREFERENCE_STORAGE_KEY, initialValue)
  }
  const calendarStorage: CalendarStorage = {
    getItem: vi.fn((key) => storedValues.get(key) ?? null),
    setItem: vi.fn((key, value) => {
      storedValues.set(key, value)
    }),
  }
  return calendarStorage
}

describe("calendar display preference persistence", () => {
  it("defaults to reminder icons when no preference is stored", () => {
    expect(loadDisplayPreference(createMemoryCalendarStorage())).toEqual({
      status: "success",
      showHours: false,
    })
  })

  it("round-trips the selected presentation through a versioned key", () => {
    const calendarStorage = createMemoryCalendarStorage()

    expect(persistDisplayPreference(true, calendarStorage)).toEqual({
      status: "success",
    })
    expect(calendarStorage.setItem).toHaveBeenCalledWith(
      DISPLAY_PREFERENCE_STORAGE_KEY,
      JSON.stringify({ version: 1, showHours: true }),
    )
    expect(loadDisplayPreference(calendarStorage)).toEqual({
      status: "success",
      showHours: true,
    })
  })

  it.each([
    ["malformed JSON", "not-json"],
    ["a null payload", JSON.stringify(null)],
    ["an unsupported version", JSON.stringify({ version: 2, showHours: true })],
    ["a nonboolean preference", JSON.stringify({ version: 1, showHours: 1 })],
  ])("rejects %s", (_scenario, storedValue) => {
    expect(
      loadDisplayPreference(createMemoryCalendarStorage(storedValue)),
    ).toEqual({
      status: "failure",
      errorMessage: expect.any(String),
    })
  })

  it("reports blocked reads and writes", () => {
    const unavailableCalendarStorage: CalendarStorage = {
      getItem: vi.fn(() => {
        throw new Error("Storage is unavailable")
      }),
      setItem: vi.fn(() => {
        throw new Error("Storage is unavailable")
      }),
    }

    expect(loadDisplayPreference(unavailableCalendarStorage)).toEqual({
      status: "failure",
      errorMessage: "Storage is unavailable",
    })
    expect(persistDisplayPreference(true, unavailableCalendarStorage)).toEqual({
      status: "failure",
      errorMessage: "Storage is unavailable",
    })
  })

  it("hydrates and persists the display choice across store sessions", () => {
    const calendarStorage = createMemoryCalendarStorage(
      JSON.stringify({ version: 1, showHours: true }),
    )
    const firstCalendarStore = createCalendarStore({ calendarStorage })

    expect(firstCalendarStore.getState().showHours.showHours).toBe(true)

    firstCalendarStore.dispatch(hideHoursOnCalendar())

    expect(
      createCalendarStore({ calendarStorage }).getState().showHours.showHours,
    ).toBe(false)
  })

  it("reports display preference hydration and save failures", () => {
    const unavailableCalendarStorage: CalendarStorage = {
      getItem: vi.fn(() => {
        throw new Error("Storage is unavailable")
      }),
      setItem: vi.fn(() => {
        throw new Error("Storage is unavailable")
      }),
    }
    const calendarStore = createCalendarStore({
      calendarStorage: unavailableCalendarStorage,
    })

    expect(
      calendarStore.getState().storageStatus.failureMessages.displayPreference,
    ).toBe(DISPLAY_PREFERENCE_LOAD_FAILURE_MESSAGE)

    calendarStore.dispatch(showHoursOnCalendar())

    expect(
      calendarStore.getState().storageStatus.failureMessages.displayPreference,
    ).toBe(DISPLAY_PREFERENCE_SAVE_FAILURE_MESSAGE)
  })

  it("does not rewrite the display choice for reminder transitions", () => {
    const calendarStorage = createMemoryCalendarStorage()
    const calendarStore = createCalendarStore({ calendarStorage })

    calendarStore.dispatch(
      addNewReminder({
        dateISOString: "2026-07-15T09:00:00.000Z",
        color: "DodgerBlue",
        text: "Portfolio review",
      }),
    )

    expect(calendarStorage.setItem).not.toHaveBeenCalledWith(
      DISPLAY_PREFERENCE_STORAGE_KEY,
      expect.any(String),
    )
  })
})

