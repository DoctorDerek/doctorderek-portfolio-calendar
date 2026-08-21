import {
  documentGetInitialProps,
  DocumentHeadTags,
  type DocumentHeadTagsProps,
} from "@mui/material-nextjs/v16-pagesRouter"
import {
  Head,
  Html,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentProps,
} from "next/document"

type MyDocumentProps = DocumentProps & DocumentHeadTagsProps

export default function MyDocument(props: MyDocumentProps) {
  return (
    <Html lang="en" className="h-full w-full" suppressHydrationWarning>
      <Head>
        <DocumentHeadTags {...props} />
        <meta charSet="utf-8" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon-io/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-io/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-io/favicon-16x16.png"
        />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="manifest" href="/favicon-io/site.webmanifest" />
      </Head>

      <body className="h-full w-full subpixel-antialiased">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = async (context: DocumentContext) =>
  documentGetInitialProps(context)
