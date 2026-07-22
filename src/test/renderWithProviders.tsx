import { render } from "@testing-library/react"
import type { ReactElement } from "react"
import { Provider } from "react-redux"
import { MaterialUIWrapper } from "@/components/NextIndexWrapper"
import { createCalendarStore, type RootState } from "@/redux/store"

export function renderWithProviders(
  ui: ReactElement,
  preloadedState?: RootState,
) {
  const store = createCalendarStore({
    preloadedState,
    reminderStorage: null,
  })

  return {
    store,
    ...render(
      <MaterialUIWrapper>
        <Provider store={store}>{ui}</Provider>
      </MaterialUIWrapper>,
    ),
  }
}
