import { configureStore } from "@reduxjs/toolkit"
import { combineReducers } from "redux"
import addReminder from "@/redux/addReminderSlice"
import agenda from "@/redux/agendaSlice"
import reminders from "@/redux/remindersSlice"
import reset from "@/redux/resetSlice"
import showHours from "@/redux/showHoursSlice"

export const rootReducer = combineReducers({
  addReminder,
  agenda,
  reminders,
  reset,
  showHours,
})

const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export default store
