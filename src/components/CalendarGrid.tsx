import Typography from "@mui/material/Typography"
import CalendarDay from "@/src/components/CalendarDay"
import { daysArray, getMonthCells } from "@/src/utils/dateUtils"

export default function CalendarGrid({ todaysDate }: { todaysDate: Date }) {
  const calendarCells = getMonthCells(todaysDate)
  return (
    <div className="flex w-full flex-col items-center justify-center shadow-xl">
      <CalendarGridDaysRow />
      <CalendarGridMonth
        todaysDate={todaysDate}
        calendarCells={calendarCells}
      />
    </div>
  )

  function CalendarGridDaysRow() {
    return (
      <div className="grid w-full grid-cols-7">
        {daysArray.map((day: string) => (
          <Typography
            className="mx-auto text-xl font-medium text-gray-800 drop-shadow-md dark:text-gray-200"
            key={day}
          >
            <span className="hidden md:block">{day}</span>
            <span className="block sm:hidden">{day.slice(0, 1)}</span>
            <span className="hidden sm:block md:hidden">{day.slice(0, 3)}</span>
          </Typography>
        ))}
      </div>
    )
  }

  function CalendarGridMonth({
    calendarCells,
    todaysDate,
  }: {
    calendarCells: Date[]
    todaysDate: Date
  }) {
    return (
      <div className="grid w-full grid-cols-7">
        {calendarCells.map((date) => (
          <CalendarDay
            key={String(date)}
            todaysDate={todaysDate}
            selectedDate={date}
          />
        ))}
      </div>
    )
  }
}
