import { createSlice } from "@reduxjs/toolkit"

const initialResetState: Record<string, never> = {}

/** resetSlice has a "force reset" action to reset the store when testing */
const resetSlice = createSlice({
  name: "reset",
  initialState: initialResetState,
  reducers: {
    resetReduxStore() {
      return {}
    },
  },
})

export const { resetReduxStore } = resetSlice.actions
export default resetSlice.reducer
