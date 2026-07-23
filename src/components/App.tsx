import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import Paper from "@mui/material/Paper"
import dayjs from "dayjs"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useState } from "react"
import AddReminder from "@/components/AddReminder"
import AddReminderFab from "@/components/AddReminderFab"
import AgendaDay from "@/components/AgendaDay"
import CalendarGrid from "@/components/CalendarGrid"
import CustomIcon from "@/components/CustomIcon"
import StorageStatus from "@/components/StorageStatus"
import ToggleShowHours from "@/components/ToggleShowHours"
import useCurrentDate from "@/hooks/useCurrentDate"
import {
  formatCalendarMonthHeading,
  getCalendarDateInMonth,
} from "@/utils/dateUtils"

const ToggleDarkMode = dynamic(() => import("@/components/ToggleDarkMode"), {
  ssr: false,
})

export default function App() {
  const actualToday = useCurrentDate()
  const [visibleMonth, setVisibleMonth] = useState(actualToday)
  const [activeDate, setActiveDate] = useState(actualToday)
  const showMonth = (monthOffset: number) => {
    const nextVisibleMonth = dayjs(visibleMonth)
      .add(monthOffset, "month")
      .toDate()
    setVisibleMonth(nextVisibleMonth)
    setActiveDate((currentActiveDate) =>
      getCalendarDateInMonth(currentActiveDate, nextVisibleMonth),
    )
  }
  const showPreviousMonth = () => {
    showMonth(-1)
  }
  const showNextMonth = () => {
    showMonth(1)
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
            <h1
              className="col-start-2 row-start-1 min-w-0 text-center text-2xl font-bold text-gray-900 drop-shadow-lg sm:text-4xl md:col-start-3 lg:text-5xl dark:text-gray-100"
              id="calendar-month-heading"
              aria-live="polite"
              aria-atomic="true"
            >
              {formatCalendarMonthHeading(visibleMonth)}
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
          <CalendarGrid
            activeDate={activeDate}
            actualToday={actualToday}
            onActiveDateChange={setActiveDate}
            onVisibleMonthChange={setVisibleMonth}
            visibleMonth={visibleMonth}
          />
          <div className="mt-3 flex w-full items-center gap-3">
            <StorageStatus />
            <AddReminderFab />
          </div>
        </Paper>
        <AgendaDay />
        <AddReminder />
      </div>
      <div aria-hidden="true" className="fixed inset-0 z-0 h-full w-full">
        <Image
          src="/benjamin-patin-dOzoyaYjCbM-unsplash.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 z-0 h-full w-full opacity-0 backdrop-brightness-50 backdrop-filter transition-all duration-500 dark:bg-[rgba(0,0,0,0.3)] dark:opacity-100"></div>
      </div>
    </>
  )
}

