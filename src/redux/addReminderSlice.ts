import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const initialAddReminderState: {
  addReminderIsOpen: boolean
  dateISOString: string
} = {
  addReminderIsOpen: false,
  dateISOString: "",
}

const addReminderSlice = createSlice({
  name: "addReminder",
  initialState: initialAddReminderState,
  reducers: {
    openAddReminder(state, action: PayloadAction<string>) {
      state.addReminderIsOpen = true
      state.dateISOString = action.payload
    },
    closeAddReminder(state) {
      state.addReminderIsOpen = false
    },
  },
})

export const { openAddReminder, closeAddReminder } = addReminderSlice.actions
export default addReminderSlice.reducer
