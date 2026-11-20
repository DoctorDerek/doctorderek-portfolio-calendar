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
export const REMINDER_MAX_LENGTH = 30

export type ReminderColor = (typeof REMINDER_COLORS)[number]

export const reminderColorClass = {
  DodgerBlue: "[--reminder-color:dodgerblue] text-black",
  Gray: "[--reminder-color:gray] text-black",
  LightGray: "[--reminder-color:lightgray] text-black",
  MediumSeaGreen: "[--reminder-color:mediumseagreen] text-black",
  Orange: "[--reminder-color:orange] text-black",
  SlateBlue: "[--reminder-color:slateblue] text-white",
  Tomato: "[--reminder-color:tomato] text-black",
  Violet: "[--reminder-color:violet] text-black",
} satisfies Record<ReminderColor, string>

export type Reminder = {
  id: string
  dateISOString: string
  color: ReminderColor
  text: string
}

export type NewReminder = Omit<Reminder, "id">
