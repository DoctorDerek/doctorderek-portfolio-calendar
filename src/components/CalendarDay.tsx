import AccessAlarmIcon from "@mui/icons-material/AccessAlarm"
import { Avatar } from "@mui/material"
import dayjs from "dayjs"
import type { KeyboardEventHandler, RefCallback } from "react"
import type { Reminder, ReminderColor } from "@/reminderTypes"
import combineClassNames from "@/utils/combineClassNames"
import {
  formatCalendarDayAccessibleName,
  formatReminderTime,
} from "@/utils/dateUtils"

export default function CalendarDay({
  actualToday,
  buttonRef,
  onActive,
  onOpenAgenda,
  onKeyDown,
  reminders,
  selectedDate,
  showHours,
  tabIndex,
  visibleMonth,
}: {
  actualToday: Date
  buttonRef?: RefCallback<HTMLButtonElement>
  onActive: () => void
  onOpenAgenda: (date: Date) => void
  onKeyDown?: KeyboardEventHandler<HTMLButtonElement>
  reminders: readonly Reminder[]
  selectedDate: Date
  showHours: boolean
  tabIndex: number
  visibleMonth: Date
}) {
  const selectedDateAtCurrentTime = dayjs(selectedDate)
    .hour(dayjs(actualToday).hour())
    .minute(dayjs(actualToday).minute())
    .toDate()

  const onClick = () => {
    onActive()
    onOpenAgenda(selectedDateAtCurrentTime)
  }

  const isToday = dayjs(selectedDateAtCurrentTime).isSame(actualToday, "day")

  const reminderCountLabel =
    reminders.length === 1 ? "1 reminder" : `${reminders.length} reminders`
  const formattedCalendarDate = formatCalendarDayAccessibleName(
    selectedDateAtCurrentTime,
  )
  const ariaLabel =
    reminders.length > 0
      ? `${formattedCalendarDate}, ${reminderCountLabel}`
      : formattedCalendarDate

  return (
    <button
      type="button"
      ref={buttonRef}
      onFocus={onActive}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      className={combineClassNames(
        "group relative flex h-full min-h-12 w-full cursor-pointer flex-wrap items-center justify-center border border-solid border-gray-300 p-0.5 sm:min-h-20 sm:p-1 lg:min-h-24 dark:border-gray-700",
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
          isToday
            ? "m-px border-current bg-purple-700 text-white shadow-xl group-hover:bg-purple-800 group-focus:bg-purple-800 md:mx-0.5"
            : "bg-transparent text-gray-900 group-hover:border-current group-hover:bg-gray-300 group-hover:text-gray-950 group-hover:shadow-xl group-focus:border-current group-focus:bg-gray-300 group-focus:text-gray-950 group-focus:shadow-xl dark:text-gray-100 dark:group-hover:bg-gray-700 dark:group-hover:text-white dark:group-focus:bg-gray-700 dark:group-focus:text-white",
        )}
      >
        {dayjs(selectedDateAtCurrentTime).date()}
      </span>
      {reminders.map(({ id, dateISOString, color, text }) => (
        <div
          className={combineClassNames(
            "flex min-w-0",
            showHours
              ? "w-full"
              : "w-auto group-hover:w-full group-focus:w-full",
          )}
          key={id}
        >
          {!showHours && <ReminderIcon color={color} />}
          <div
            className={combineClassNames(
              "line-clamp-1 w-full rounded-sm px-1 text-left text-[0.625rem] sm:text-xs lg:text-sm",
              !showHours &&
                "sr-only group-hover:not-sr-only group-focus:not-sr-only",
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
      className="m-px h-5 w-5 border border-solid border-gray-300 group-hover:hidden group-focus:hidden md:mx-0.5"
    >
      <AccessAlarmIcon className="h-4 w-4" />
    </Avatar>
  )
}
