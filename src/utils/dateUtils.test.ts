import { describe, expect, it } from "vitest"
import { getCalendarDateInMonth, getCalendarDateKey } from "@/utils/dateUtils"

describe("calendar date identity", () => {
  it("preserves the local calendar day late in the evening", () => {
    expect(getCalendarDateKey(new Date(2026, 6, 15, 23, 30))).toBe("2026-07-15")
  })

  it("clamps an active day to the target month", () => {
    expect(
      getCalendarDateKey(
        getCalendarDateInMonth(
          new Date(2026, 0, 31, 12),
          new Date(2026, 1, 1, 12),
        ),
      ),
    ).toBe("2026-02-28")
  })
})

