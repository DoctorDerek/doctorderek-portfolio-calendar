import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit"
import dayjs from "dayjs"
import type { NewReminder, Reminder } from "@/reminderTypes"

const initialRemindersState: {
  reminders: Reminder[]
} = {
  reminders: [],
}

const remindersSlice = createSlice({
  name: "reminders",
  initialState: initialRemindersState,
  reducers: {
    addNewReminder: {
      reducer(state, action: PayloadAction<Reminder>) {
        state.reminders.push(action.payload)
        state.reminders.sort((left, right) =>
          dayjs(left.dateISOString).diff(dayjs(right.dateISOString)),
        )
      },
      prepare(reminder: NewReminder) {
        return {
          payload: {
            ...reminder,
            id: nanoid(),
          },
        }
      },
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
