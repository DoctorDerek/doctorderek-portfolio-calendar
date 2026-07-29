import "@/css/tailwind.css"
import type { AppProps } from "next/app"
import { Roboto } from "next/font/google"
import Head from "next/head"

const roboto = Roboto({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Calendar</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>

      <main className={roboto.className}>
        <Component {...pageProps} />
      </main>
    </>
  )
}
