import "@/src/css/tailwind.css"
import type { AppProps } from "next/app"
import Head from "next/head"

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Calendar App - React / Redux - Material UI</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>

      <Component {...pageProps} />
    </>
  )
}
