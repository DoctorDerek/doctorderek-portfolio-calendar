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
  const [todaysDate, setTodaysDate] = useState(new Date())
  const prevMonth = () => {
    setTodaysDate((currentDate) =>
      dayjs(currentDate).subtract(1, "month").toDate(),
    )
  }
  const nextMonth = () => {
    setTodaysDate((currentDate) => dayjs(currentDate).add(1, "month").toDate())
  }

  return (
    <>
      <div className="relative z-10 flex w-full items-center justify-center">
        <Paper
          className="m-6 flex h-full w-full flex-col items-center justify-center rounded-3xl p-3"
          classes={{
            root: "backdrop-filter backdrop-grayscale backdrop-blur bg-[rgba(255,255,255,0.3)] dark:bg-[rgba(0,0,0,0.3)]",
          }}
        >
          <header className="my-10 flex w-full items-center justify-between">
            <CustomIcon
              ariaLabel="Previous Month"
              onClick={prevMonth}
              color="blue"
              Icon={KeyboardArrowLeftIcon}
            />
            <ToggleDarkMode />
            <div className="mb-2 text-7xl font-bold text-gray-800 drop-shadow-xl dark:text-gray-300">
              {formatDateAsMonthApp(todaysDate)}
            </div>
            <ToggleShowHours />
            <CustomIcon
              ariaLabel="Next Month"
              onClick={nextMonth}
              color="blue"
              Icon={KeyboardArrowRightIcon}
            />
          </header>
          <CalendarGrid todaysDate={todaysDate} />
        </Paper>
        <AddReminderFab position="fixed" />
        <AgendaDay />
        <AddReminder />
      </div>
      <div className="fixed inset-0 z-0 h-full w-full">
        {/* background image */}
        <Image
          src="/benjamin-patin-dOzoyaYjCbM-unsplash.jpg"
          alt="Ocean waves breaking by Benjamin Patin on Unsplash"
          layout="fill"
          className="object-cover"
        />
        <div className="absolute inset-0 z-0 h-full w-full opacity-0 backdrop-brightness-50 backdrop-filter transition-all duration-500 dark:bg-[rgba(0,0,0,0.3)] dark:opacity-100">
          {/* dark mode filter for background image */}
        </div>
      </div>
    </>
  )
}
