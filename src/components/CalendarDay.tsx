import dayjs from "dayjs"
import { useState } from "react"

import { openAgenda } from "@/src/redux/agendaSlice"
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks"
import { Avatar } from "@mui/material"
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm"

const classNames = (...classes: string[]) => classes.join(" ")
const formatDateCalendarDay = (date: Date) =>
  dayjs(date).format("dddd MMMM D, YYYY")
const formatTimePicker = (date: Date) => dayjs(date).format("h:mm A")

export default function CalendarDay({
  selectedDate,
  todaysDate,
}: {
  selectedDate: Date
  todaysDate: Date
}) {
  selectedDate = dayjs(selectedDate).hour(dayjs(todaysDate).hour()).toDate()
  selectedDate = dayjs(selectedDate).minute(dayjs(todaysDate).minute()).toDate()

  const { showHours } = useAppSelector(({ showHours }) => showHours)

  const { reminders } = useAppSelector(({ reminders }) => reminders)
  const calendarDayReminders = reminders.filter((reminder) => {
    return dayjs(reminder.dateISOString).isSame(selectedDate, "day")
  })

  const dispatch = useAppDispatch()
  const onDayClick = (selectedDate: Date) => {
    dispatch(openAgenda(selectedDate.toISOString()))
  }
  const [focused, setFocused] = useState(false)
  const onMouseOver = () => setFocused(true)
  const onMouseOut = () => setFocused(false)
  const onClick = () => onDayClick(selectedDate)

  const isToday = dayjs(selectedDate).isSame(todaysDate, "day")

  const ariaLabel = formatDateCalendarDay(selectedDate)

  return (
    <button
      onMouseOver={onMouseOver}
      onFocus={onMouseOver}
      onMouseOut={onMouseOut}
      onBlur={onMouseOut}
      onClick={onClick}
      onKeyDown={(event) => event.key === "Enter" && onClick()}
      className={classNames(
        "border-1 border-solid border-gray-300 cursor-pointer flex flex-wrap justify-center items-center",
        dayjs(selectedDate).isSame(todaysDate, "month")
          ? "bg-gray-50 bg-opacity-40"
          : "bg-gray-800 bg-opacity-40",
      )}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Avatar
        className={classNames(
          "text-gray-800 dark:text-gray-200 border-transparent border-1 border-solid",
          isToday && focused
            ? "bg-purple-600 shadow-xl border-current m-[1px] md:mx-0.5" // focused today's avatar
            : isToday
              ? "bg-purple-400 shadow-xl border-current m-[1px] md:mx-0.5" // today's avatar
              : focused
                ? "bg-gray-400 shadow-xl border-current"
                : "bg-transparent",
        )}
        data-testid={ariaLabel}
      >
        {dayjs(selectedDate).date()}
      </Avatar>
      {calendarDayReminders.map(({ id, dateISOString, color, text }) => (
        <div
          className={classNames("flex group", showHours ? "w-full" : "w-auto")}
          key={id}
        >
          {!showHours && <CustomAvatar color={color} />}
          <div
            className={classNames(
              showHours
                ? "text-sm w-full line-clamp-1 text-left px-1 rounded-sm"
                : "p-2 text-xl shadow-lg rounded-3xl absolute z-20 hidden group-hover:block",
            )}
            style={{ backgroundColor: color }}
          >
            <span className="font-medium">
              {formatTimePicker(dayjs(dateISOString).toDate())}
            </span>{" "}
            {text}
          </div>
        </div>
      ))}
    </button>
  )

  function CustomAvatar({ color }: { color: Color }) {
    return (
      <Avatar
        style={{ backgroundColor: color }}
        className="w-5 h-5 m-[1px] md:mx-0.5 border-1 border-solid border-gray-300"
      >
        <AccessAlarmIcon className="w-4 h-4" />
      </Avatar>
    )
  }
}
