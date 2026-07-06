// Note: this file will run before any test file and will run on all tests.
import "@testing-library/jest-dom/extend-expect"

import { resetReduxStore } from "@/src/redux/resetSlice"
import store from "@/src/redux/store"

global.afterEach(() => {
  store.dispatch(resetReduxStore())
})

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
