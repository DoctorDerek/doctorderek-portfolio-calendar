import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { HeadManagerContext } from "next/dist/shared/lib/head-manager-context.shared-runtime"
import { HtmlContext } from "next/dist/shared/lib/html-context.shared-runtime"
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime"
import Router, { type NextRouter } from "next/router"
import type { ComponentProps, ReactElement, ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, describe, expect, it, vi } from "vitest"
import MyApp from "@/pages/_app"
import MyDocument from "@/pages/_document"
import Page, { getStaticProps } from "@/pages/index"

vi.mock("next/font/google", () => ({
  Roboto: () => ({ className: "calendar-roboto" }),
}))

type HeadElement = ReactElement<{
  name?: string
  content?: string
  children?: ReactNode
}>

function createDocumentProps() {
  return {
    __NEXT_DATA__: {
      props: {},
      page: "/",
      query: {},
      buildId: "calendar-test",
    },
    dangerousAsPath: "/",
    docComponentsRendered: {},
    buildManifest: {
      devFiles: [],
      polyfillFiles: [],
      lowPriorityFiles: [],
      rootMainFiles: [],
      rootMainFilesTree: {},
      pages: { "/": [], "/_app": [] },
    },
    isDevelopment: false,
    deploymentId: undefined,
    dynamicImports: [],
    dynamicCssManifest: new Set<string>(),
    headTags: [],
    assetQueryString: "",
    mutableAssetQueryString: "",
    cssAssetQueryString: "",
    scriptLoader: {},
    head: [],
  } satisfies NonNullable<ComponentProps<typeof HtmlContext.Provider>["value"]>
}

describe("authored Next page entry points", () => {
  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it("seeds the page from the UTC date and revalidates hourly", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-07-16T00:05:00.000Z"))
    expect(getStaticProps()).toEqual({
      props: { initialCurrentDateKey: "2026-07-16" },
      revalidate: 3600,
    })
  })

  it("renders the dated calendar through the real app/cache/providers and publishes metadata", async () => {
    vi.useFakeTimers({ toFake: ["Date"] })
    vi.setSystemTime(new Date(2026, 6, 15, 12))
    const updateHead = vi.fn<(elements: HeadElement[]) => void>()
    const router: NextRouter = {
      basePath: "",
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      isLocaleDomain: false,
      isFallback: false,
      isReady: true,
      isPreview: false,
      push: vi.fn(async () => true),
      replace: vi.fn(async () => true),
      reload: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      prefetch: vi.fn(async () => undefined),
      beforePopState: vi.fn(),
      events: Router.events,
    }
    render(
      <RouterContext.Provider value={router}>
        <HeadManagerContext.Provider
          value={{ updateHead, mountedInstances: new Set<ReactNode>() }}
        >
          <MyApp
            Component={Page}
            pageProps={{ initialCurrentDateKey: "2026-07-15" }}
          />
        </HeadManagerContext.Provider>
      </RouterContext.Provider>,
    )
    expect(
      screen.getByRole("heading", { level: 1, name: "July 2026" }),
    ).toBeVisible()
    expect(screen.getByRole("region", { name: "Calendar" })).toBeVisible()
    fireEvent.click(screen.getByRole("button", { name: "Next Month" }))
    expect(
      screen.getByRole("heading", { level: 1, name: "August 2026" }),
    ).toBeVisible()
    await waitFor(() => expect(updateHead).toHaveBeenCalled())
    const head = updateHead.mock.calls.at(-1)![0]
    expect(
      head.find((element) => element.type === "title")?.props.children,
    ).toBe("Calendar")
    expect(
      head.find(
        (element) =>
          element.type === "meta" && element.props.name === "description",
      )?.props.content,
    ).toBe(
      "A responsive TypeScript calendar for creating, color-coding, reviewing, and deleting reminders.",
    )
    expect(document.querySelector("main")).toHaveClass("calendar-roboto")
  })

  it("server-renders the document with language, icons, manifest and the Next runtime", () => {
    const props = createDocumentProps()
    const markup = renderToStaticMarkup(
      <HtmlContext.Provider value={props}>
        <MyDocument />
      </HtmlContext.Provider>,
    )
    const parsed = new DOMParser().parseFromString(markup, "text/html")
    expect(parsed.documentElement.lang).toBe("en")
    expect(parsed.querySelector("meta[charset]")).toHaveAttribute(
      "charset",
      "utf-8",
    )
    expect(parsed.querySelector('link[rel="manifest"]')).toHaveAttribute(
      "href",
      "/favicon-io/site.webmanifest",
    )
    expect(parsed.querySelectorAll('link[rel="icon"]')).toHaveLength(2)
    expect(parsed.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#FFFFFF",
    )
    expect(parsed.querySelector('script[id="__NEXT_DATA__"]')).not.toBeNull()
    expect(props.docComponentsRendered).toEqual({
      Html: true,
      Head: true,
      Main: true,
      NextScript: true,
    })
  })
})
