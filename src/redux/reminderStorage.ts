import {
  REMINDER_COLORS,
  REMINDER_MAX_LENGTH,
  type Reminder,
  type ReminderColor,
} from "@/reminderTypes"

export type ReminderStorage = Pick<Storage, "getItem" | "setItem">

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

const getBrowserReminderStorage = () => {
  try {
    return typeof window === "undefined" ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

const isReminderColor = (value: unknown): value is ReminderColor =>
  typeof value === "string" &&
  REMINDER_COLORS.some((reminderColor) => reminderColor === value)

const isReminder = (value: unknown): value is Reminder => {
  if (typeof value !== "object" || value === null) return false

  const reminder = value as UnvalidatedReminder
  return (
    typeof reminder.id === "string" &&
    reminder.id.length > 0 &&
    typeof reminder.dateISOString === "string" &&
    Number.isFinite(Date.parse(reminder.dateISOString)) &&
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
  reminderStorage: ReminderStorage | undefined = getBrowserReminderStorage(),
) => {
  if (!reminderStorage) return []

  try {
    const serializedReminderStorage = reminderStorage.getItem(
      REMINDER_STORAGE_KEY,
    )
    if (!serializedReminderStorage) return []

    const parsedReminderStorage: unknown = JSON.parse(
      serializedReminderStorage,
    )
    return isReminderStorage(parsedReminderStorage)
      ? parsedReminderStorage.reminders
      : []
  } catch {
    return []
  }
}

export const persistReminders = (
  reminders: Reminder[],
  reminderStorage: ReminderStorage | undefined = getBrowserReminderStorage(),
) => {
  if (!reminderStorage) return false

  try {
    reminderStorage.setItem(
      REMINDER_STORAGE_KEY,
      JSON.stringify({
        version: REMINDER_STORAGE_VERSION,
        reminders,
      }),
    )
    return true
  } catch {
    return false
  }
}
