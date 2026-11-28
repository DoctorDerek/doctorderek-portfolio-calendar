import CalendarIcon, { type CalendarIconName } from "@/components/CalendarIcon"
import combineClassNames from "@/utils/combineClassNames"

export default function CustomIcon({
  ariaLabel,
  id,
  onClick,
  icon,
  size = "large",
}: {
  ariaLabel: string
  id?: string
  onClick: () => void
  icon: CalendarIconName
  size?: "small" | "large"
}) {
  return (
    <button
      id={id}
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      className={combineClassNames(
        "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-transparent transition-colors hover:bg-black/5 motion-reduce:transition-none dark:hover:bg-white/10",
        size === "small"
          ? "h-8 w-8 text-current"
          : "h-12 w-12 text-black/55 sm:h-14 sm:w-14 dark:text-white",
      )}
      onClick={onClick}
    >
      <CalendarIcon name={icon} className="size-6" />
    </button>
  )
}
