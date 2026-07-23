import {
  resolveCalendarStorage,
  type CalendarStorage,
  type CalendarStorageFailure,
} from "@/redux/calendarStorage"
import { getErrorMessage } from "@/utils/errorUtils"

export const DISPLAY_PREFERENCE_STORAGE_KEY =
  "portfolio-calendar.display-preference"

const DISPLAY_PREFERENCE_STORAGE_VERSION = 1

type UnvalidatedDisplayPreferenceStorage = {
  version?: unknown
  showHours?: unknown
}

export type LoadDisplayPreferenceResult =
  { status: "success"; showHours: boolean } | CalendarStorageFailure

export type PersistDisplayPreferenceResult =
  { status: "success" } | CalendarStorageFailure

const isDisplayPreferenceStorage = (
  value: unknown,
): value is { version: number; showHours: boolean } => {
  if (typeof value !== "object" || value === null) return false

  const displayPreference = value as UnvalidatedDisplayPreferenceStorage
  return (
    displayPreference.version === DISPLAY_PREFERENCE_STORAGE_VERSION &&
    typeof displayPreference.showHours === "boolean"
  )
}

export const loadDisplayPreference = (
  calendarStorage?: CalendarStorage,
): LoadDisplayPreferenceResult => {
  const calendarStorageResult = resolveCalendarStorage(calendarStorage)
  if (calendarStorageResult.status === "failure") {
    return calendarStorageResult
  }

  try {
    const serializedDisplayPreference =
      calendarStorageResult.calendarStorage.getItem(
        DISPLAY_PREFERENCE_STORAGE_KEY,
      )
    if (!serializedDisplayPreference) {
      return { status: "success", showHours: false }
    }

    const parsedDisplayPreference: unknown = JSON.parse(
      serializedDisplayPreference,
    )
    return isDisplayPreferenceStorage(parsedDisplayPreference)
      ? { status: "success", showHours: parsedDisplayPreference.showHours }
      : {
          status: "failure",
          errorMessage: "Stored display preference data is invalid",
        }
  } catch (error: unknown) {
    return { status: "failure", errorMessage: getErrorMessage(error) }
  }
}

export const persistDisplayPreference = (
  showHours: boolean,
  calendarStorage?: CalendarStorage,
): PersistDisplayPreferenceResult => {
  const calendarStorageResult = resolveCalendarStorage(calendarStorage)
  if (calendarStorageResult.status === "failure") {
    return calendarStorageResult
  }

  try {
    calendarStorageResult.calendarStorage.setItem(
      DISPLAY_PREFERENCE_STORAGE_KEY,
      JSON.stringify({
        version: DISPLAY_PREFERENCE_STORAGE_VERSION,
        showHours,
      }),
    )
    return { status: "success" }
  } catch (error: unknown) {
    return { status: "failure", errorMessage: getErrorMessage(error) }
  }
}

