import "@/css/tailwind.css"
import {
  AppCacheProvider,
  type EmotionCacheProviderProps,
} from "@mui/material-nextjs/v16-pagesRouter"
import type { AppProps } from "next/app"
import { Roboto } from "next/font/google"
import Head from "next/head"

const roboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

type MyAppProps = AppProps & EmotionCacheProviderProps

export default function MyApp({
  Component,
  emotionCache,
  pageProps,
}: MyAppProps) {
  return (
    <AppCacheProvider emotionCache={emotionCache}>
      <>
        <Head>
          <title>Calendar</title>
          <meta
            name="description"
            content="A responsive TypeScript calendar for creating, color-coding, reviewing, and deleting reminders."
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>

        <main className={roboto.className}>
          <Component {...pageProps} />
        </main>
      </>
    </AppCacheProvider>
  )
}
