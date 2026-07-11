import AccessAlarmIcon from "@mui/icons-material/AccessAlarm"
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder"
import { motion } from "motion/react"
import CustomIcon from "@/components/CustomIcon"
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
    ? "Currently showing hours on the calendar"
    : "Currently showing icons on the calendar"

  return (
    <motion.div
      onTap={toggleShowHours}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={classNames(
        "relative h-8 w-24 rounded-full bg-transparent text-lg font-bold backdrop-blur backdrop-filter transition-all duration-500",
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
        className="w-16 rounded-full"
        animate={{ x: showHours ? "0rem" : "4rem" }}
      >
        {showHours ? (
          <CustomIcon
            ariaLabel={ariaLabel}
            color={color}
            Icon={QueryBuilderIcon}
            onClick={() => {}}
            size="small"
          />
        ) : (
          <CustomIcon
            ariaLabel={ariaLabel}
            color={color}
            Icon={AccessAlarmIcon}
            onClick={() => {}}
            size="small"
          />
        )}
      </motion.div>
    </motion.div>
  )
}
