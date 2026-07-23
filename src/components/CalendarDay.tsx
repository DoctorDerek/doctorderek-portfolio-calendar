import AccessAlarmIcon from "@mui/icons-material/AccessAlarm"
import { Avatar } from "@mui/material"
import dayjs from "dayjs"
import {
  useState,
  type KeyboardEventHandler,
  type RefCallback,
} from "react"
import { openAgenda } from "@/redux/agendaSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import type { ReminderColor } from "@/reminderTypes"
import combineClassNames from "@/utils/combineClassNames"
import {
  formatCalendarDayAccessibleName,
  formatReminderTime,
} from "@/utils/dateUtils"

export default function CalendarDay({
  actualToday,
  buttonRef,
  onActive,
  onKeyDown,
  selectedDate,
  tabIndex,
  visibleMonth,
}: {
  actualToday: Date
  buttonRef?: RefCallback<HTMLButtonElement>
  onActive: () => void
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>
  selectedDate: Date
  tabIndex: number
  visibleMonth: Date
}) {
  const selectedDateAtCurrentTime = dayjs(selectedDate)
    .hour(dayjs(actualToday).hour())
    .minute(dayjs(actualToday).minute())
    .toDate()

  const { showHours } = useAppSelector(({ showHours }) => showHours)

  const { reminders } = useAppSelector(({ reminders }) => reminders)
  const calendarDayReminders = reminders.filter((reminder) => {
    return dayjs(reminder.dateISOString).isSame(
      selectedDateAtCurrentTime,
      "day",
    )
  })

  const dispatch = useAppDispatch()
  const onDayClick = (selectedDate: Date) => {
    dispatch(openAgenda(selectedDate.toISOString()))
  }
  const [focused, setFocused] = useState(false)
  const showReminderDetails = () => setFocused(true)
  const hideReminderDetails = () => setFocused(false)
  const onFocus = () => {
    showReminderDetails()
    onActive()
  }
  const onClick = () => {
    onActive()
    onDayClick(selectedDateAtCurrentTime)
  }

  const isToday = dayjs(selectedDateAtCurrentTime).isSame(actualToday, "day")

  const reminderCountLabel =
    calendarDayReminders.length === 1
      ? "1 reminder"
      : `${calendarDayReminders.length} reminders`
  const formattedCalendarDate = formatCalendarDayAccessibleName(
    selectedDateAtCurrentTime,
  )
  const ariaLabel =
    calendarDayReminders.length > 0
      ? `${formattedCalendarDate}, ${reminderCountLabel}`
      : formattedCalendarDate

  return (
    <button
      type="button"
      ref={buttonRef}
      onMouseEnter={showReminderDetails}
      onFocus={onFocus}
      onMouseLeave={hideReminderDetails}
      onBlur={hideReminderDetails}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      className={combineClassNames(
        "relative flex h-full min-h-12 w-full cursor-pointer flex-wrap items-center justify-center border border-solid border-gray-300 p-0.5 sm:min-h-20 sm:p-1 lg:min-h-24 dark:border-gray-700",
        dayjs(selectedDateAtCurrentTime).isSame(visibleMonth, "month")
          ? "bg-white/65 dark:bg-gray-900/75"
          : "bg-gray-300/65 dark:bg-gray-950/85",
      )}
      aria-label={ariaLabel}
      aria-current={isToday ? "date" : undefined}
      title={ariaLabel}
    >
      <span
        className={combineClassNames(
          "flex h-8 w-8 items-center justify-center rounded-full border border-solid border-transparent text-sm sm:h-10 sm:w-10 sm:text-base",
          isToday && focused
            ? "m-px border-current bg-purple-800 text-white shadow-xl md:mx-0.5"
            : isToday
              ? "m-px border-current bg-purple-700 text-white shadow-xl md:mx-0.5"
              : focused
                ? "border-current bg-gray-300 text-gray-950 shadow-xl dark:bg-gray-700 dark:text-white"
                : "bg-transparent text-gray-900 dark:text-gray-100",
        )}
      >
        {dayjs(selectedDateAtCurrentTime).date()}
      </span>
      {calendarDayReminders.map(({ id, dateISOString, color, text }) => (
        <div
          className={combineClassNames(
            "flex min-w-0",
            showHours || focused ? "w-full" : "w-auto",
          )}
          key={id}
        >
          {!showHours && !focused && <ReminderIcon color={color} />}
          <div
            className={combineClassNames(
              showHours || focused
                ? "line-clamp-1 w-full rounded-sm px-1 text-left text-[0.625rem] sm:text-xs lg:text-sm"
                : "sr-only",
            )}
            style={{ backgroundColor: color }}
          >
            <span className="font-medium">
              {formatReminderTime(dayjs(dateISOString).toDate())}
            </span>{" "}
            {text}
          </div>
        </div>
      ))}
    </button>
  )
}

function ReminderIcon({ color }: { color: ReminderColor }) {
  return (
    <Avatar
      style={{ backgroundColor: color }}
      className="m-px h-5 w-5 border border-solid border-gray-300 md:mx-0.5"
    >
      <AccessAlarmIcon className="h-4 w-4" />
    </Avatar>
  )
}

