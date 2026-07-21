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
      <div className="relative z-10 flex w-full items-center justify-center">
        <Paper
          className="m-2 flex h-full w-full flex-col items-center justify-center rounded-3xl p-3 sm:m-6"
          classes={{
            root: "backdrop-filter backdrop-grayscale backdrop-blur bg-[rgba(255,255,255,0.3)] dark:bg-[rgba(0,0,0,0.3)]",
          }}
        >
          <header className="my-6 grid w-full grid-cols-2 items-center gap-y-4 md:my-10 md:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] md:gap-3 lg:gap-4">
            <div className="col-start-1 row-start-3 justify-self-start md:col-start-1 md:row-start-1">
              <CustomIcon
                ariaLabel="Previous Month"
                onClick={showPreviousMonth}
                color="blue"
                Icon={KeyboardArrowLeftIcon}
              />
            </div>
            <div className="col-start-1 row-start-2 justify-self-end pr-2 md:col-start-2 md:row-start-1 md:pr-0">
              <ToggleDarkMode />
            </div>
            <div className="col-span-2 col-start-1 row-start-1 mb-2 min-w-0 text-center text-3xl font-bold text-gray-800 drop-shadow-xl sm:text-5xl md:col-span-1 md:col-start-3 md:row-start-1 lg:text-7xl dark:text-gray-300">
              {formatDateAsMonthApp(visibleMonth)}
            </div>
            <div className="col-start-2 row-start-2 justify-self-start pl-2 md:col-start-4 md:row-start-1 md:pl-0">
              <ToggleShowHours />
            </div>
            <div className="col-start-2 row-start-3 justify-self-end md:col-start-5 md:row-start-1">
              <CustomIcon
                ariaLabel="Next Month"
                onClick={showNextMonth}
                color="blue"
                Icon={KeyboardArrowRightIcon}
              />
            </div>
          </header>
          <CalendarGrid actualToday={actualToday} visibleMonth={visibleMonth} />
        </Paper>
        <AddReminderFab position="fixed" />
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
