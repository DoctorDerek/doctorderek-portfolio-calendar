import { combineReducers, configureStore } from "@reduxjs/toolkit"
import addReminder from "@/redux/addReminderSlice"
import agenda from "@/redux/agendaSlice"
import type { CalendarStorage } from "@/redux/calendarStorage"
import {
  loadDisplayPreference,
  persistDisplayPreference,
} from "@/redux/displayPreferenceStorage"
import reminders from "@/redux/remindersSlice"
import {
  loadPersistedReminders,
  persistReminders,
} from "@/redux/reminderStorage"
import showHours from "@/redux/showHoursSlice"
import storageStatus, {
  DISPLAY_PREFERENCE_LOAD_FAILURE_MESSAGE,
  DISPLAY_PREFERENCE_SAVE_FAILURE_MESSAGE,
  REMINDER_LOAD_FAILURE_MESSAGE,
  REMINDER_SAVE_FAILURE_MESSAGE,
  storageFailureReported,
  storageRecovered,
} from "@/redux/storageStatusSlice"

export const rootReducer = combineReducers({
  addReminder,
  agenda,
  reminders,
  showHours,
  storageStatus,
})

export type RootState = ReturnType<typeof rootReducer>
type CalendarStoreOptions = {
  preloadedState?: RootState
  calendarStorage?: CalendarStorage | null
}

export function createCalendarStore({
  preloadedState,
  calendarStorage,
}: CalendarStoreOptions = {}) {
  const initialState = rootReducer(undefined, { type: "calendar/initialize" })
  const reminderHydrationResult =
    calendarStorage === null
      ? { status: "success" as const, reminders: [] }
      : loadPersistedReminders(calendarStorage)
  const displayPreferenceHydrationResult =
    calendarStorage === null
      ? { status: "success" as const, showHours: false }
      : loadDisplayPreference(calendarStorage)
  const hydratedState =
    preloadedState ??
    ({
      ...initialState,
      reminders: {
        reminders:
          reminderHydrationResult.status === "success"
            ? reminderHydrationResult.reminders
            : [],
      },
      showHours: {
        showHours:
          displayPreferenceHydrationResult.status === "success"
            ? displayPreferenceHydrationResult.showHours
            : false,
      },
      storageStatus: {
        failureMessages: {
          ...(reminderHydrationResult.status === "failure"
            ? { reminders: REMINDER_LOAD_FAILURE_MESSAGE }
            : {}),
          ...(displayPreferenceHydrationResult.status === "failure"
            ? {
                displayPreference: DISPLAY_PREFERENCE_LOAD_FAILURE_MESSAGE,
              }
            : {}),
        },
      },
    } satisfies RootState)

  const calendarStore = configureStore({
    reducer: rootReducer,
    preloadedState: hydratedState,
  })

  if (calendarStorage !== null) {
    let previousReminders = calendarStore.getState().reminders.reminders
    let previousShowHours = calendarStore.getState().showHours.showHours
    calendarStore.subscribe(() => {
      const currentState = calendarStore.getState()
      const currentReminders = currentState.reminders.reminders
      const currentShowHours = currentState.showHours.showHours

      if (currentReminders !== previousReminders) {
        previousReminders = currentReminders
        const reminderPersistenceResult = persistReminders(
          currentReminders,
          calendarStorage,
        )
        calendarStore.dispatch(
          reminderPersistenceResult.status === "failure"
            ? storageFailureReported({
                domain: "reminders",
                message: REMINDER_SAVE_FAILURE_MESSAGE,
              })
            : storageRecovered("reminders"),
        )
      }

      if (currentShowHours !== previousShowHours) {
        previousShowHours = currentShowHours
        const displayPreferencePersistenceResult = persistDisplayPreference(
          currentShowHours,
          calendarStorage,
        )
        calendarStore.dispatch(
          displayPreferencePersistenceResult.status === "failure"
            ? storageFailureReported({
                domain: "displayPreference",
                message: DISPLAY_PREFERENCE_SAVE_FAILURE_MESSAGE,
              })
            : storageRecovered("displayPreference"),
        )
      }
    })
  }

  return calendarStore
}

const store = createCalendarStore()

export type AppDispatch = typeof store.dispatch

export default store

