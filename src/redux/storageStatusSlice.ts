import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export const REMINDER_LOAD_FAILURE_MESSAGE =
  "Your saved reminders couldn’t be loaded."
export const REMINDER_SAVE_FAILURE_MESSAGE =
  "Your latest reminder change couldn’t be saved."
export const DISPLAY_PREFERENCE_LOAD_FAILURE_MESSAGE =
  "Your saved calendar display preference couldn’t be loaded."
export const DISPLAY_PREFERENCE_SAVE_FAILURE_MESSAGE =
  "Your calendar display preference couldn’t be saved."

type StorageStatusState = {
  failureMessages: Partial<Record<StorageFailureDomain, string>>
}

export type StorageFailureDomain = "reminders" | "displayPreference"

const initialStorageStatusState: StorageStatusState = {
  failureMessages: {},
}

const storageStatusSlice = createSlice({
  name: "storageStatus",
  initialState: initialStorageStatusState,
  reducers: {
    storageFailureReported(
      state,
      action: PayloadAction<{
        domain: StorageFailureDomain
        message: string
      }>,
    ) {
      state.failureMessages[action.payload.domain] = action.payload.message
    },
    storageRecovered(state, action: PayloadAction<StorageFailureDomain>) {
      delete state.failureMessages[action.payload]
    },
  },
})

export const { storageFailureReported, storageRecovered } =
  storageStatusSlice.actions
export default storageStatusSlice.reducer

