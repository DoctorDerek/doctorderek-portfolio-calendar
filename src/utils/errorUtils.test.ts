import { describe, expect, it } from "vitest"
import { getErrorMessage } from "@/utils/errorUtils"

describe("unknown error messages", () => {
  it("preserves native and structural error messages", () => {
    expect(getErrorMessage(new Error("Native failure"))).toBe("Native failure")
    expect(getErrorMessage({ message: "Structural failure" })).toBe(
      "Structural failure",
    )
  })

  it.each([
    ["a primitive", "failure", '"failure"'],
    ["null", null, "null"],
    ["an object without a message", {}, "{}"],
    ["a non-string message", { message: 42 }, '{"message":42}'],
    ["undefined", undefined, ""],
  ])("serializes %s safely", (_scenario, value, expectedMessage) => {
    expect(getErrorMessage(value)).toBe(expectedMessage)
  })

  it("falls back to string conversion for circular values", () => {
    type CircularValue = { self?: CircularValue }
    const circularValue: CircularValue = {}
    circularValue.self = circularValue

    expect(getErrorMessage(circularValue)).toBe("[object Object]")
  })
})
