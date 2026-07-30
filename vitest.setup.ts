import { cleanup } from "@testing-library/react"
import type { ImageProps } from "next/image"
import { createElement } from "react"
import { afterEach, vi } from "vitest"
import "@testing-library/jest-dom/vitest"

vi.mock("next/image", () => ({
  default: ({ alt, className, fill, placeholder, sizes, src }: ImageProps) => {
    const imageSource =
      typeof src === "string"
        ? src
        : "default" in src
          ? src.default.src
          : src.src

    return createElement("img", {
      alt,
      className,
      "data-fill": String(fill),
      "data-placeholder": placeholder,
      sizes,
      src: imageSource,
    })
  },
}))

vi.mock("@/assets/benjamin-patin-dOzoyaYjCbM-unsplash.jpg", () => ({
  default: {
    blurDataURL: "data:image/jpeg;base64,Y2FsZW5kYXItYmFja2dyb3VuZA==",
    blurHeight: 6,
    blurWidth: 8,
    height: 3000,
    src: "/_next/static/media/benjamin-patin-dOzoyaYjCbM-unsplash.test.jpg",
    width: 4000,
  },
}))

afterEach(() => {
  cleanup()
})

/**
 * ONE-TIME EXCEPTION TO NO CODE COMMENT RULE:
 * Required mock for Happy-DOM/JSDOM to prevent crashes when components
 * (e.g., using next-themes, framer-motion, MUI) evaluate media queries.
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
