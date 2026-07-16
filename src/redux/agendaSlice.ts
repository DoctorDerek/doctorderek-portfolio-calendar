import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialAgendaState: {
  agendaIsOpen: boolean
  dateISOString: string
} = { agendaIsOpen: false, dateISOString: "" }

const agendaSlice = createSlice({
  name: "agenda",
  initialState: initialAgendaState,
  reducers: {
    openAgenda(state, action: PayloadAction<string>) {
      state.agendaIsOpen = true
      state.dateISOString = action.payload
    },
    closeAgenda(state) {
      state.agendaIsOpen = false
    },
  },
})

export const { openAgenda, closeAgenda } = agendaSlice.actions
export default agendaSlice.reducer
