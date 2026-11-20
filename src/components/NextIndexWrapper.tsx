import { ThemeProvider } from "next-themes"
import { useMemo, useSyncExternalStore } from "react"
import { Provider } from "react-redux"
import App from "@/components/App"
import { createCalendarStore } from "@/redux/store"

const subscribeToHydration = () => () => undefined
const getBrowserHydrationSnapshot = () => true
const getServerHydrationSnapshot = () => false

type NextIndexWrapperProps = {
  initialCurrentDateKey?: string
}

export default function NextIndexWrapper({
  initialCurrentDateKey,
}: NextIndexWrapperProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReduxWrapper>
        <App initialCurrentDateKey={initialCurrentDateKey} />
      </ReduxWrapper>
    </ThemeProvider>
  )
}

export function ReduxWrapper({ children }: { children: React.ReactNode }) {
  const initialCalendarStore = useMemo(
    () => createCalendarStore({ calendarStorage: null }),
    [],
  )
  const persistedCalendarStore = useMemo(
    () =>
      typeof window === "undefined"
        ? initialCalendarStore
        : createCalendarStore(),
    [initialCalendarStore],
  )
  const hydrationIsComplete = useSyncExternalStore(
    subscribeToHydration,
    getBrowserHydrationSnapshot,
    getServerHydrationSnapshot,
  )

  return (
    <Provider
      store={
        hydrationIsComplete ? persistedCalendarStore : initialCalendarStore
      }
    >
      {children}
    </Provider>
  )
}
