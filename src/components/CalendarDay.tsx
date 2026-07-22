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
  actualToday,
  selectedDate,
  visibleMonth,
}: {
  actualToday: Date
  selectedDate: Date
  visibleMonth: Date
}) {
  const selectedDateAtCurrentTime = dayjs(selectedDate)
    .hour(dayjs(actualToday).hour())
    .minute(dayjs(actualToday).minute())
    .toDate()

  const { showHours } = useAppSelector(({ showHours }) => showHours)

  const { reminders } = useAppSelector(({ reminders }) => reminders)
  const calendarDayReminders = reminders.filter((reminder) => {
    return dayjs(reminder.dateISOString).isSame(selectedDateAtCurrentTime, "day")
  })

  const dispatch = useAppDispatch()
  const onDayClick = (selectedDate: Date) => {
    dispatch(openAgenda(selectedDate.toISOString()))
  }
  const [focused, setFocused] = useState(false)
  const onMouseOver = () => setFocused(true)
  const onMouseOut = () => setFocused(false)
  const onClick = () => onDayClick(selectedDateAtCurrentTime)

  const isToday = dayjs(selectedDateAtCurrentTime).isSame(actualToday, "day")

  const ariaLabel = formatDateCalendarDay(selectedDateAtCurrentTime)

  return (
    <button
      type="button"
      onMouseOver={onMouseOver}
      onFocus={onMouseOver}
      onMouseOut={onMouseOut}
      onBlur={onMouseOut}
      onClick={onClick}
      className={classNames(
        "relative flex min-h-12 cursor-pointer flex-wrap items-center justify-center border border-solid border-gray-300 p-0.5 sm:min-h-20 sm:p-1 lg:min-h-24 dark:border-gray-700",
        dayjs(selectedDateAtCurrentTime).isSame(visibleMonth, "month")
          ? "bg-white/65 dark:bg-gray-900/75"
          : "bg-gray-300/65 dark:bg-gray-950/85",
      )}
      aria-label={ariaLabel}
      aria-current={isToday ? "date" : undefined}
      title={ariaLabel}
    >
      <Avatar
        className={classNames(
          "h-8 w-8 border border-solid border-transparent text-sm text-gray-900 sm:h-10 sm:w-10 sm:text-base dark:text-gray-100",
          isToday && focused
            ? "m-px border-current bg-purple-600 shadow-xl md:mx-0.5"
            : isToday
              ? "m-px border-current bg-purple-400 shadow-xl md:mx-0.5"
              : focused
                ? "border-current bg-gray-400 shadow-xl"
                : "bg-transparent",
        )}
      >
        {dayjs(selectedDateAtCurrentTime).date()}
      </Avatar>
      {calendarDayReminders.map(({ id, dateISOString, color, text }) => (
        <div
          className={classNames(
            "flex min-w-0",
            showHours || focused ? "w-full" : "w-auto",
          )}
          key={id}
        >
          {!showHours && !focused && <CustomAvatar color={color} />}
          <div
            className={classNames(
              showHours || focused
                ? "line-clamp-1 w-full rounded-sm px-1 text-left text-[0.625rem] sm:text-xs lg:text-sm"
                : "sr-only",
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
