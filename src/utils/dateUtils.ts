import dayjs from "dayjs"

const CALENDAR_CELL_COUNT = 42

export const CALENDAR_WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

export const formatCalendarMonthHeading = (date: Date) =>
  dayjs(date).format("MMMM YYYY")

export const formatCalendarDate = (date: Date) =>
  dayjs(date).format("MMMM D, YYYY")

export const formatCalendarDayAccessibleName = (date: Date) =>
  dayjs(date).format("dddd MMMM D, YYYY")

export const formatReminderTime = (date: Date) => dayjs(date).format("h:mm A")

export const getCalendarDateKey = (date: Date) =>
  dayjs(date).format("YYYY-MM-DD")

export const getCalendarDateInMonth = (date: Date, targetMonth: Date) => {
  const month = dayjs(targetMonth)
  return month.date(Math.min(dayjs(date).date(), month.daysInMonth())).toDate()
}

export function getMonthCells(visibleMonth: Date) {
  const month = dayjs(visibleMonth)
  const daysInMonth = month.daysInMonth()
  const firstOfMonth = month.startOf("month")
  const lastOfMonth = month.endOf("month")
  const firstDayOfMonth = firstOfMonth.day()
  const daysAfter = CALENDAR_CELL_COUNT - (daysInMonth + firstDayOfMonth)

  const previousMonthCells = []
  const visibleMonthCells = []
  const nextMonthCells = []

  for (let dayOffset = firstDayOfMonth; dayOffset > 0; dayOffset--) {
    previousMonthCells.push(firstOfMonth.subtract(dayOffset, "day").toDate())
  }

  for (let dayOffset = 0; dayOffset < daysInMonth; dayOffset++) {
    visibleMonthCells.push(firstOfMonth.add(dayOffset, "day").toDate())
  }

  for (let dayOffset = 1; dayOffset <= daysAfter; dayOffset++) {
    nextMonthCells.push(lastOfMonth.add(dayOffset, "day").toDate())
  }

  return [...previousMonthCells, ...visibleMonthCells, ...nextMonthCells]
}

