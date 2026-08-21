import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles"
import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes"
import { useMemo, useSyncExternalStore } from "react"
import { Provider } from "react-redux"
import App from "@/components/App"
import { createCalendarStore } from "@/redux/store"

const subscribeToHydration = () => () => undefined
const getBrowserHydrationSnapshot = () => true
const getServerHydrationSnapshot = () => false

export default function NextIndexWrapper() {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MaterialUIWrapper>
        <ReduxWrapper>
          <App />
        </ReduxWrapper>
      </MaterialUIWrapper>
    </NextThemeProvider>
  )
}

export function MaterialUIWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useNextTheme()
  const materialTheme = useMemo(
    () =>
      createTheme({
        palette: { mode: resolvedTheme === "dark" ? "dark" : "light" },
      }),
    [resolvedTheme],
  )

  return (
    <StyledEngineProvider injectFirst>
      <MaterialThemeProvider theme={materialTheme}>
        {children}
      </MaterialThemeProvider>
    </StyledEngineProvider>
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
