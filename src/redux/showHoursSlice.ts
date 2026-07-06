import { createSlice } from "@reduxjs/toolkit"

const initialShowHoursState: {
  showHours: boolean
} = {
  showHours: false,
}

const showHoursSlice = createSlice({
  name: "showHours",
  initialState: initialShowHoursState,
  reducers: {
    showHoursOnCalendar(state) {
      state.showHours = true
    },
    hideHoursOnCalendar(state) {
      state.showHours = false
    },
  },
})

export const { showHoursOnCalendar, hideHoursOnCalendar } =
  showHoursSlice.actions
export default showHoursSlice.reducer
