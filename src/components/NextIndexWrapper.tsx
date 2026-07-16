import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles"
import { ThemeProvider as NextThemeProvider } from "next-themes"
import { Provider } from "react-redux"
import App from "@/components/App"
import store from "@/redux/store"

export default function NextIndexWrapper() {
  return (
    <MaterialUIWrapper>
      <ReduxWrapper>
        <App />
      </ReduxWrapper>
    </MaterialUIWrapper>
  )
}

export function MaterialUIWrapper({ children }: { children: React.ReactNode }) {
  const defaultTheme = createTheme()
  return (
    <StyledEngineProvider injectFirst>
      <MaterialThemeProvider theme={defaultTheme}>
        <NextThemeProvider attribute="class">{children}</NextThemeProvider>
      </MaterialThemeProvider>
    </StyledEngineProvider>
  )
}

export function ReduxWrapper({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
