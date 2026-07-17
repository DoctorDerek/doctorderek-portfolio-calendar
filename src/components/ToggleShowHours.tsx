import AccessAlarmIcon from "@mui/icons-material/AccessAlarm"
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder"
import { motion } from "motion/react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
  hideHoursOnCalendar,
  showHoursOnCalendar,
} from "@/redux/showHoursSlice"

const classNames = (...classes: string[]) => classes.join(" ")
export default function ToggleShowHours() {
  const { showHours } = useAppSelector(({ showHours }) => showHours)
  const color = showHours ? "gray" : "purple"

  const dispatch = useAppDispatch()
  const toggleShowHours = () => {
    if (showHours) dispatch(hideHoursOnCalendar())
    else dispatch(showHoursOnCalendar())
  }

  const ariaLabel = showHours
    ? "Show reminder icons on the calendar"
    : "Show reminder hours on the calendar"

  return (
    <motion.button
      type="button"
      onClick={toggleShowHours}
      aria-label={ariaLabel}
      aria-pressed={showHours}
      title={ariaLabel}
      className={classNames(
        "relative h-8 w-24 rounded-full border-0 bg-transparent p-0 text-lg font-bold backdrop-blur backdrop-filter transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500",
        (color === "gray" &&
          "border-gray-300 text-gray-500 hover:border-gray-500 hover:bg-gray-300 hover:text-gray-700") as string,
        (color === "purple" &&
          "border-purple-300 text-purple-500 hover:border-purple-500 hover:bg-purple-300 hover:text-purple-700") as string,
      )}
    >
      {showHours ? (
        <span className="absolute top-0.5 right-2">Hours</span>
      ) : (
        <span className="absolute top-0.5 left-3">Icons</span>
      )}
      <motion.div
        className={classNames(
          "dark:bg-opacity-80 flex h-8 w-8 items-center justify-center rounded-full border border-solid bg-gray-100 fill-current transition-all duration-500",
          (color === "gray" &&
            "border-gray-300 text-gray-500 hover:border-gray-500 hover:bg-gray-300 hover:text-gray-700") as string,
          (color === "purple" &&
            "border-purple-300 text-purple-500 hover:border-purple-500 hover:bg-purple-300 hover:text-purple-700") as string,
        )}
        animate={{ x: showHours ? "0rem" : "4rem" }}
      >
        {showHours ? (
          <QueryBuilderIcon aria-hidden="true" className="h-6 w-6" />
        ) : (
          <AccessAlarmIcon aria-hidden="true" className="h-6 w-6" />
        )}
      </motion.div>
    </motion.button>
  )
}
