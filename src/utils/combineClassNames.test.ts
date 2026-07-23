import { describe, expect, it } from "vitest"
import combineClassNames from "@/utils/combineClassNames"

describe("class name composition", () => {
  it("omits inactive conditional classes", () => {
    expect(combineClassNames("base", false, null, undefined, "active")).toBe(
      "base active",
    )
  })
})

