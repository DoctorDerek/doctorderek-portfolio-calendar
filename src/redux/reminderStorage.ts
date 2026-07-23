import {
  resolveCalendarStorage,
  type CalendarStorage,
  type CalendarStorageFailure,
} from "@/redux/calendarStorage"
import {
  REMINDER_COLORS,
  REMINDER_MAX_LENGTH,
  type Reminder,
  type ReminderColor,
} from "@/reminderTypes"
import { getErrorMessage } from "@/utils/errorUtils"

export const REMINDER_STORAGE_KEY = "portfolio-calendar.reminders"

const REMINDER_STORAGE_VERSION = 1

type UnvalidatedReminder = {
  id?: unknown
  dateISOString?: unknown
  color?: unknown
  text?: unknown
}

type UnvalidatedReminderStorage = {
  version?: unknown
  reminders?: unknown
}

export type LoadPersistedRemindersResult =
  { status: "success"; reminders: Reminder[] } | CalendarStorageFailure

export type PersistRemindersResult =
  { status: "success" } | CalendarStorageFailure

const isReminderColor = (value: unknown): value is ReminderColor =>
  typeof value === "string" &&
  REMINDER_COLORS.some((reminderColor) => reminderColor === value)

const isCanonicalISOString = (value: unknown): value is string => {
  if (typeof value !== "string") return false

  const date = new Date(value)
  return Number.isFinite(date.getTime()) && date.toISOString() === value
}

const isReminder = (value: unknown): value is Reminder => {
  if (typeof value !== "object" || value === null) return false

  const reminder = value as UnvalidatedReminder
  return (
    typeof reminder.id === "string" &&
    reminder.id.length > 0 &&
    isCanonicalISOString(reminder.dateISOString) &&
    isReminderColor(reminder.color) &&
    typeof reminder.text === "string" &&
    reminder.text === reminder.text.trim() &&
    reminder.text.length > 0 &&
    reminder.text.length <= REMINDER_MAX_LENGTH
  )
}

const isReminderStorage = (
  value: unknown,
): value is { version: number; reminders: Reminder[] } => {
  if (typeof value !== "object" || value === null) return false

  const reminderStorage = value as UnvalidatedReminderStorage
  if (
    reminderStorage.version !== REMINDER_STORAGE_VERSION ||
    !Array.isArray(reminderStorage.reminders) ||
    !reminderStorage.reminders.every(isReminder)
  ) {
    return false
  }

  const reminderIds = reminderStorage.reminders.map(({ id }) => id)
  return new Set(reminderIds).size === reminderIds.length
}

export const loadPersistedReminders = (
  calendarStorage?: CalendarStorage,
): LoadPersistedRemindersResult => {
  const calendarStorageResult = resolveCalendarStorage(calendarStorage)
  if (calendarStorageResult.status === "failure") {
    return calendarStorageResult
  }

  try {
    const serializedReminderStorage =
      calendarStorageResult.calendarStorage.getItem(REMINDER_STORAGE_KEY)
    if (!serializedReminderStorage) return { status: "success", reminders: [] }

    const parsedReminderStorage: unknown = JSON.parse(serializedReminderStorage)
    return isReminderStorage(parsedReminderStorage)
      ? {
          status: "success",
          reminders: [...parsedReminderStorage.reminders].sort((left, right) =>
            left.dateISOString.localeCompare(right.dateISOString),
          ),
        }
      : {
          status: "failure",
          errorMessage: "Stored reminder data is invalid",
        }
  } catch (error: unknown) {
    return { status: "failure", errorMessage: getErrorMessage(error) }
  }
}

export const persistReminders = (
  reminders: Reminder[],
  calendarStorage?: CalendarStorage,
): PersistRemindersResult => {
  const calendarStorageResult = resolveCalendarStorage(calendarStorage)
  if (calendarStorageResult.status === "failure") {
    return calendarStorageResult
  }

  try {
    calendarStorageResult.calendarStorage.setItem(
      REMINDER_STORAGE_KEY,
      JSON.stringify({
        version: REMINDER_STORAGE_VERSION,
        reminders,
      }),
    )
    return { status: "success" }
  } catch (error: unknown) {
    return { status: "failure", errorMessage: getErrorMessage(error) }
  }
}

