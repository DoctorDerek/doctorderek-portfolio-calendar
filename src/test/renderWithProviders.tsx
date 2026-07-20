import { configureStore } from "@reduxjs/toolkit"
import { render } from "@testing-library/react"
import type { ReactElement } from "react"
import { Provider } from "react-redux"
import { MaterialUIWrapper } from "@/components/NextIndexWrapper"
import { rootReducer, type RootState } from "@/redux/store"

export function renderWithProviders(
  ui: ReactElement,
  preloadedState?: RootState,
) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
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
