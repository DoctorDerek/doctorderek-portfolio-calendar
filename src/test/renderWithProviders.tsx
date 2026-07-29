import { render } from "@testing-library/react"
import type { ReactElement, ReactNode } from "react"
import { Provider } from "react-redux"
import { MaterialUIWrapper } from "@/components/NextIndexWrapper"
import { createCalendarStore, type RootState } from "@/redux/store"

export function renderWithProviders(
  ui: ReactElement,
  preloadedState?: RootState,
) {
  const store = createCalendarStore({
    preloadedState,
    calendarStorage: null,
  })
  const TestProviders = ({ children }: { children: ReactNode }) => (
    <MaterialUIWrapper>
      <Provider store={store}>{children}</Provider>
    </MaterialUIWrapper>
  )

  return {
    store,
    ...render(ui, { wrapper: TestProviders }),
  }
}
