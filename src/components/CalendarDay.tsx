import AccessAlarmIcon from "@mui/icons-material/AccessAlarm"
import { Avatar } from "@mui/material"
import dayjs from "dayjs"
import { useState } from "react"
import { openAgenda } from "@/redux/agendaSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import type { ReminderColor } from "@/reminderTypes"

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
        "flex cursor-pointer flex-wrap items-center justify-center border border-solid border-gray-300",
        dayjs(selectedDate).isSame(todaysDate, "month")
          ? "bg-opacity-40 bg-gray-50"
          : "bg-opacity-40 bg-gray-800",
      )}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      <Avatar
        className={classNames(
          "border border-solid border-transparent text-gray-800 dark:text-gray-200",
          isToday && focused
            ? "m-px border-current bg-purple-600 shadow-xl md:mx-0.5"
            : isToday
              ? "m-px border-current bg-purple-400 shadow-xl md:mx-0.5"
              : focused
                ? "border-current bg-gray-400 shadow-xl"
                : "bg-transparent",
        )}
        data-testid={ariaLabel}
      >
        {dayjs(selectedDate).date()}
      </Avatar>
      {calendarDayReminders.map(({ id, dateISOString, color, text }) => (
        <div
          className={classNames("group flex", showHours ? "w-full" : "w-auto")}
          key={id}
        >
          {!showHours && <CustomAvatar color={color} />}
          <div
            className={classNames(
              showHours
                ? "line-clamp-1 w-full rounded-sm px-1 text-left text-sm"
                : "absolute z-20 hidden rounded-3xl p-2 text-xl shadow-lg group-hover:block",
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

  function CustomAvatar({ color }: { color: ReminderColor }) {
    return (
      <Avatar
        style={{ backgroundColor: color }}
        className="m-px h-5 w-5 border border-solid border-gray-300 md:mx-0.5"
      >
        <AccessAlarmIcon className="h-4 w-4" />
      </Avatar>
    )
  }
}
