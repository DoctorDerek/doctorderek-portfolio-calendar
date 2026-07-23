import Typography from "@mui/material/Typography"
import dayjs from "dayjs"
import { useEffect, useRef, type KeyboardEvent } from "react"
import CalendarDay from "@/components/CalendarDay"
import {
  CALENDAR_WEEKDAY_NAMES,
  getCalendarDateKey,
  getCalendarDateInMonth,
  getMonthCells,
} from "@/utils/dateUtils"

export default function CalendarGrid({
  activeDate,
  actualToday,
  onActiveDateChange,
  visibleMonth,
  onVisibleMonthChange,
}: {
  activeDate: Date
  actualToday: Date
  onActiveDateChange: (date: Date) => void
  onVisibleMonthChange: (month: Date) => void
  visibleMonth: Date
}) {
  const calendarCells = getMonthCells(visibleMonth)
  return (
    <section
      aria-label="Calendar"
      className="flex w-full flex-col items-center justify-center overflow-hidden rounded-xl shadow-xl"
    >
      <div
        aria-labelledby="calendar-month-heading"
        className="w-full"
        role="grid"
      >
        <CalendarGridDaysRow />
        <CalendarGridMonth
          actualToday={actualToday}
          activeDate={activeDate}
          calendarCells={calendarCells}
          onActiveDateChange={onActiveDateChange}
          onVisibleMonthChange={onVisibleMonthChange}
          visibleMonth={visibleMonth}
        />
      </div>
    </section>
  )
}

function CalendarGridDaysRow() {
  return (
    <div
      className="grid w-full grid-cols-7 bg-white/65 py-1 sm:py-2 dark:bg-gray-950/70"
      role="row"
    >
      {CALENDAR_WEEKDAY_NAMES.map((weekdayName) => (
        <Typography
          aria-label={weekdayName}
          className="mx-auto text-xs font-semibold text-gray-900 drop-shadow-sm sm:text-base lg:text-lg dark:text-gray-100"
          key={weekdayName}
          role="columnheader"
        >
          <span className="hidden md:block">{weekdayName}</span>
          <span className="block sm:hidden">{weekdayName.slice(0, 1)}</span>
          <span className="hidden sm:block md:hidden">
            {weekdayName.slice(0, 3)}
          </span>
        </Typography>
      ))}
    </div>
  )
}

function CalendarGridMonth({
  calendarCells,
  activeDate,
  actualToday,
  onActiveDateChange,
  onVisibleMonthChange,
  visibleMonth,
}: {
  calendarCells: Date[]
  activeDate: Date
  actualToday: Date
  onActiveDateChange: (date: Date) => void
  onVisibleMonthChange: (month: Date) => void
  visibleMonth: Date
}) {
  const activeDateKey = getCalendarDateKey(activeDate)
  const calendarDayButtons = useRef(new Map<string, HTMLButtonElement>())
  const pendingFocusDateKey = useRef<string | null>(null)
  const calendarWeeks = Array.from(
    {
      length: calendarCells.length / CALENDAR_WEEKDAY_NAMES.length,
    },
    (_, weekIndex) =>
      calendarCells.slice(
        weekIndex * CALENDAR_WEEKDAY_NAMES.length,
        (weekIndex + 1) * CALENDAR_WEEKDAY_NAMES.length,
      ),
  )
  const moveCalendarFocus = (
    event: KeyboardEvent<HTMLButtonElement>,
    selectedDate: Date,
  ) => {
    const selectedDateIndex = calendarCells.findIndex(
      (date) => getCalendarDateKey(date) === getCalendarDateKey(selectedDate),
    )
    if (selectedDateIndex === -1) return

    const selectedWeekStartIndex =
      Math.floor(selectedDateIndex / CALENDAR_WEEKDAY_NAMES.length) *
      CALENDAR_WEEKDAY_NAMES.length
    const selectedWeekEndIndex =
      selectedWeekStartIndex + CALENDAR_WEEKDAY_NAMES.length - 1
    const targetDateIndex = (() => {
      switch (event.key) {
        case "ArrowLeft":
          return selectedDateIndex - 1
        case "ArrowRight":
          return selectedDateIndex + 1
        case "ArrowUp":
          return selectedDateIndex - CALENDAR_WEEKDAY_NAMES.length
        case "ArrowDown":
          return selectedDateIndex + CALENDAR_WEEKDAY_NAMES.length
        case "Home":
          return event.ctrlKey ? 0 : selectedWeekStartIndex
        case "End":
          return event.ctrlKey
            ? calendarCells.length - 1
            : selectedWeekEndIndex
        case "PageDown":
          return { direction: event.shiftKey ? 12 : 1, selectedDate }
        case "PageUp":
          return { direction: event.shiftKey ? -12 : -1, selectedDate }
        default:
          return null
      }
    })()

    if (targetDateIndex === null) return

    event.preventDefault()

    if (typeof targetDateIndex === "object") {
      const nextVisibleMonth = dayjs(visibleMonth)
        .add(targetDateIndex.direction, "month")
        .toDate()
      const nextActiveDate = getCalendarDateInMonth(
        targetDateIndex.selectedDate,
        nextVisibleMonth,
      )
      pendingFocusDateKey.current = getCalendarDateKey(nextActiveDate)
      onVisibleMonthChange(nextVisibleMonth)
      onActiveDateChange(nextActiveDate)
      return
    }

    const targetDate = calendarCells[targetDateIndex]
    if (!targetDate) return

    onActiveDateChange(targetDate)
    calendarDayButtons.current.get(getCalendarDateKey(targetDate))?.focus()
  }

  useEffect(() => {
    const targetDateKey = pendingFocusDateKey.current
    if (!targetDateKey) return

    const targetCalendarDay = calendarDayButtons.current.get(targetDateKey)
    if (targetCalendarDay) {
      targetCalendarDay.focus()
      pendingFocusDateKey.current = null
    }
  }, [calendarCells, visibleMonth])

  return (
    <div role="rowgroup">
      {calendarWeeks.map((calendarWeek) => (
        <div
          className="grid w-full grid-cols-7"
          key={getCalendarDateKey(calendarWeek[0])}
          role="row"
        >
          {calendarWeek.map((date) => (
            <div key={getCalendarDateKey(date)} role="gridcell">
              <CalendarDay
                actualToday={actualToday}
                buttonRef={(calendarDayButton) => {
                  const calendarDateKey = getCalendarDateKey(date)
                  if (calendarDayButton) {
                    calendarDayButtons.current.set(
                      calendarDateKey,
                      calendarDayButton,
                    )
                  } else {
                    calendarDayButtons.current.delete(calendarDateKey)
                  }
                }}
                onActive={() => onActiveDateChange(date)}
                onKeyDown={(event) => moveCalendarFocus(event, date)}
                selectedDate={date}
                tabIndex={getCalendarDateKey(date) === activeDateKey ? 0 : -1}
                visibleMonth={visibleMonth}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

