export const REMINDER_COLORS = [
  "DodgerBlue",
  "Gray",
  "LightGray",
  "MediumSeaGreen",
  "Orange",
  "SlateBlue",
  "Tomato",
  "Violet",
] as const

export type ReminderColor = (typeof REMINDER_COLORS)[number]

export type Reminder = {
  id: string
  dateISOString: string
  color: ReminderColor
  text: string
}

export type NewReminder = Omit<Reminder, "id">
