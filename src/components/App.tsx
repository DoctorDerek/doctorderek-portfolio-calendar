import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import Paper from "@mui/material/Paper"
import dayjs from "dayjs"
import Image from "next/image"
import { useState } from "react"
import AddReminder from "@/components/AddReminder"
import AddReminderFab from "@/components/AddReminderFab"
import AgendaDay from "@/components/AgendaDay"
import CalendarGrid from "@/components/CalendarGrid"
import CustomIcon from "@/components/CustomIcon"
import ToggleDarkMode from "@/components/ToggleDarkMode"
import ToggleShowHours from "@/components/ToggleShowHours"

const formatDateAsMonthApp = (date: Date) => dayjs(date).format("MMMM YYYY")
export default function App() {
  const [actualToday] = useState(() => new Date())
  const [visibleMonth, setVisibleMonth] = useState(actualToday)
  const showPreviousMonth = () => {
    setVisibleMonth((currentVisibleMonth) =>
      dayjs(currentVisibleMonth).subtract(1, "month").toDate(),
    )
  }
  const showNextMonth = () => {
    setVisibleMonth((currentVisibleMonth) =>
      dayjs(currentVisibleMonth).add(1, "month").toDate(),
    )
  }

  return (
    <>
      <div className="relative z-10 flex min-h-screen w-full items-start justify-center">
        <Paper
          className="m-2 flex w-full max-w-[1600px] flex-col items-center justify-center rounded-3xl p-2 sm:m-6 sm:p-4"
          classes={{
            root: "backdrop-filter backdrop-grayscale backdrop-blur bg-[rgba(255,255,255,0.3)] dark:bg-[rgba(0,0,0,0.3)]",
          }}
        >
          <header className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-3 py-3 sm:gap-x-3 sm:py-5 md:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] md:gap-4">
            <div className="col-start-1 row-start-1 justify-self-start">
              <CustomIcon
                ariaLabel="Previous Month"
                onClick={showPreviousMonth}
                color="blue"
                Icon={KeyboardArrowLeftIcon}
              />
            </div>
            <div className="col-start-1 row-start-2 justify-self-start md:col-start-2 md:row-start-1">
              <ToggleDarkMode />
            </div>
            <h1 className="col-start-2 row-start-1 min-w-0 text-center text-2xl font-bold text-gray-900 drop-shadow-lg sm:text-4xl lg:text-5xl dark:text-gray-100">
              {formatDateAsMonthApp(visibleMonth)}
            </h1>
            <div className="col-start-3 row-start-2 justify-self-end md:col-start-4 md:row-start-1">
              <ToggleShowHours />
            </div>
            <div className="col-start-3 row-start-1 justify-self-end md:col-start-5">
              <CustomIcon
                ariaLabel="Next Month"
                onClick={showNextMonth}
                color="blue"
                Icon={KeyboardArrowRightIcon}
              />
            </div>
          </header>
          <CalendarGrid actualToday={actualToday} visibleMonth={visibleMonth} />
          <div className="mt-3 flex w-full justify-end">
            <AddReminderFab />
          </div>
        </Paper>
        <AgendaDay />
        <AddReminder />
      </div>
      <div className="fixed inset-0 z-0 h-full w-full">
        <Image
          src="/benjamin-patin-dOzoyaYjCbM-unsplash.jpg"
          alt="Ocean waves breaking by Benjamin Patin on Unsplash"
          layout="fill"
          className="object-cover"
        />
        <div className="absolute inset-0 z-0 h-full w-full opacity-0 backdrop-brightness-50 backdrop-filter transition-all duration-500 dark:bg-[rgba(0,0,0,0.3)] dark:opacity-100"></div>
      </div>
    </>
  )
}
