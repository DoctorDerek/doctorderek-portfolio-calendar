import dayjs from "dayjs"

export const daysArray = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]
export const monthsArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function getMonthCells(todaysDate: Date) {
  const totalCells = 42

  const today = dayjs(todaysDate)

  const daysInMonth = today.daysInMonth()
  const firstOfMonth = today.startOf("month")
  const lastOfMonth = today.endOf("month")
  const firstDayOfMonth = firstOfMonth.day()
  const daysAfter = totalCells - (daysInMonth + firstDayOfMonth)

  const prevMonthArray = []
  const monthArray = []
  const nextMonthArray = []

  for (let i = firstDayOfMonth; i > 0; i--) {
    prevMonthArray.push(firstOfMonth.subtract(i, "day").toDate())
  }

  for (let i = 0; i < daysInMonth; i++) {
    monthArray.push(firstOfMonth.add(i, "day").toDate())
  }

  for (let i = 0; i < daysAfter; i++) {
    nextMonthArray.push(lastOfMonth.add(i + 1, "day").toDate())
  }

  const calendarArray = [...prevMonthArray, ...monthArray, ...nextMonthArray]

  return calendarArray
}
