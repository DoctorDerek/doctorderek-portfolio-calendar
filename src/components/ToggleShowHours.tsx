import CalendarIcon from "@/components/CalendarIcon"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
  hideHoursOnCalendar,
  showHoursOnCalendar,
} from "@/redux/showHoursSlice"
import combineClassNames from "@/utils/combineClassNames"

export default function ToggleShowHours() {
  const { showHours } = useAppSelector(({ showHours }) => showHours)

  const dispatch = useAppDispatch()
  const toggleShowHours = () => {
    if (showHours) dispatch(hideHoursOnCalendar())
    else dispatch(showHoursOnCalendar())
  }

  const ariaLabel = showHours
    ? "Show reminder icons on the calendar"
    : "Show reminder hours on the calendar"

  return (
    <button
      type="button"
      onClick={toggleShowHours}
      aria-label={ariaLabel}
      aria-pressed={showHours}
      title={ariaLabel}
      className={combineClassNames(
        "relative h-10 w-24 rounded-full border-0 bg-transparent p-0 text-base font-bold backdrop-blur backdrop-filter transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-purple-500",
        showHours
          ? "text-gray-600 hover:bg-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
          : "text-purple-700 hover:bg-purple-300 hover:text-purple-900 dark:text-purple-300 dark:hover:bg-purple-900 dark:hover:text-purple-100",
      )}
    >
      {showHours ? (
        <span className="absolute top-2 right-2">Hours</span>
      ) : (
        <span className="absolute top-2 left-3">Icons</span>
      )}
      <div
        className={combineClassNames(
          "flex h-10 w-10 items-center justify-center rounded-full border border-solid bg-gray-100 fill-current transition-transform duration-200 ease-out",
          showHours
            ? "translate-x-0 border-gray-300 text-gray-600"
            : "translate-x-14 border-purple-300 text-purple-700",
        )}
      >
        <CalendarIcon name={showHours ? "clock" : "alarm"} className="size-6" />
      </div>
    </button>
  )
}
