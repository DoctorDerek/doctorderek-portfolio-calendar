import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import dayjs from "dayjs"
import type { Reminder } from "@/reminderTypes"

const initialRemindersState: {
  reminders: Reminder[]
} = {
  reminders: [],
}

const remindersSlice = createSlice({
  name: "reminders",
  initialState: initialRemindersState,
  reducers: {
    addNewReminder(state, action: PayloadAction<Reminder>) {
      action.payload.id = generateUniqueId()
      state.reminders.push(action.payload)
      state.reminders.sort((left, right) =>
        dayjs(left.dateISOString).diff(dayjs(right.dateISOString)),
      )
    },
    deleteReminder(state, action: PayloadAction<string>) {
      state.reminders = state.reminders.filter(
        (reminder) => reminder.id !== action.payload,
      )
    },
  },
})

export const { addNewReminder, deleteReminder } = remindersSlice.actions
export default remindersSlice.reducer

function generateUniqueId() {
  return (
    String(Math.random() * 1000000000000000000) +
    String(Math.random() * 1000000000000000000)
  )
}
