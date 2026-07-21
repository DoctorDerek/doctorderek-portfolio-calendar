import { combineReducers, configureStore } from "@reduxjs/toolkit"
import addReminder from "@/redux/addReminderSlice"
import agenda from "@/redux/agendaSlice"
import {
  loadPersistedReminders,
  persistReminders,
  type ReminderStorage,
} from "@/redux/reminderStorage"
import reminders from "@/redux/remindersSlice"
import showHours from "@/redux/showHoursSlice"

export const rootReducer = combineReducers({
  addReminder,
  agenda,
  reminders,
  showHours,
})

export type RootState = ReturnType<typeof rootReducer>
type CalendarStoreOptions = {
  preloadedState?: RootState
  reminderStorage?: ReminderStorage | null
}

export function createCalendarStore({
  preloadedState,
  reminderStorage,
}: CalendarStoreOptions = {}) {
  const initialState = rootReducer(undefined, { type: "calendar/initialize" })
  const hydratedState =
    preloadedState ??
    ({
      ...initialState,
      reminders: {
        reminders:
          reminderStorage === null
            ? []
            : loadPersistedReminders(reminderStorage),
      },
    } satisfies RootState)

  const calendarStore = configureStore({
    reducer: rootReducer,
    preloadedState: hydratedState,
  })

  if (reminderStorage !== null) {
    let previousReminders = calendarStore.getState().reminders.reminders
    calendarStore.subscribe(() => {
      const currentReminders = calendarStore.getState().reminders.reminders
      if (currentReminders === previousReminders) return

      previousReminders = currentReminders
      persistReminders(currentReminders, reminderStorage)
    })
  }

  return calendarStore
}

const store = createCalendarStore()

export type AppDispatch = typeof store.dispatch

export default store
