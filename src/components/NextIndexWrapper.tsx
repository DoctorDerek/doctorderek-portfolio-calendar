import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles"
import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes"
import { useMemo } from "react"
import { Provider } from "react-redux"
import App from "@/components/App"
import store from "@/redux/store"

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
  return <Provider store={store}>{children}</Provider>
}
