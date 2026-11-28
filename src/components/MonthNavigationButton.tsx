import type { FocusEvent } from "react"
import CustomIcon from "@/components/CustomIcon"

export default function MonthNavigationButton({
  direction,
  placement,
  onClick,
}: {
  direction: "previous" | "next"
  placement: "header" | "actions"
  onClick: () => void
}) {
  const inHeader = placement === "header"
  const otherPlacement = inHeader ? "actions" : "header"
  const keepMonthFocusOnResize = (event: FocusEvent<HTMLDivElement>) => {
    if (event.relatedTarget) return
    document
      .getElementById(`calendar-${direction}-${otherPlacement}`)
      ?.focus({ preventScroll: true })
  }

  return (
    <div
      onBlur={keepMonthFocusOnResize}
      className={inHeader ? "hidden md:row-start-1 md:block" : "flex"}
    >
      <CustomIcon
        id={`calendar-${direction}-${placement}`}
        ariaLabel={direction === "previous" ? "Previous Month" : "Next Month"}
        icon={direction}
        onClick={onClick}
      />
    </div>
  )
}
