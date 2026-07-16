import { createSlice } from "@reduxjs/toolkit"

const initialResetState: Record<string, never> = {}

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
