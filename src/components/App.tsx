import dayjs from "dayjs"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useState } from "react"
import calendarBackground from "@/assets/benjamin-patin-dOzoyaYjCbM-unsplash.jpg"
import AddReminderFab from "@/components/AddReminderFab"
import CalendarGrid from "@/components/CalendarGrid"
import MonthNavigationButton from "@/components/MonthNavigationButton"
import StorageStatus from "@/components/StorageStatus"
import ToggleShowHours from "@/components/ToggleShowHours"
import useCurrentDate, { useInitialCurrentDate } from "@/hooks/useCurrentDate"
import { useAppSelector } from "@/redux/hooks"
import {
  formatCalendarMonthHeading,
  getCalendarDateInMonth,
} from "@/utils/dateUtils"

const ToggleDarkMode = dynamic(() => import("@/components/ToggleDarkMode"), {
  ssr: false,
})
const AddReminder = dynamic(() => import("@/components/AddReminder"))
const AgendaDay = dynamic(() => import("@/components/AgendaDay"))

export default function App({
  initialCurrentDateKey,
}: {
  initialCurrentDateKey?: string
}) {
  const actualToday = useCurrentDate(initialCurrentDateKey)
  const initialCurrentDate = useInitialCurrentDate(initialCurrentDateKey)
  const [visibleMonthOverride, setVisibleMonth] = useState<Date>()
  const [activeDateOverride, setActiveDate] = useState<Date>()
  const visibleMonth = visibleMonthOverride ?? initialCurrentDate
  const activeDate = activeDateOverride ?? initialCurrentDate
  const addReminderIsOpen = useAppSelector(
    ({ addReminder }) => addReminder.addReminderIsOpen,
  )
  const agendaIsOpen = useAppSelector(({ agenda }) => agenda.agendaIsOpen)

  const showMonth = (monthOffset: number) => {
    const nextVisibleMonth = dayjs(visibleMonth)
      .add(monthOffset, "month")
      .toDate()
    setVisibleMonth(nextVisibleMonth)
    setActiveDate(getCalendarDateInMonth(activeDate, nextVisibleMonth))
  }
  const showPreviousMonth = () => {
    showMonth(-1)
  }
  const showNextMonth = () => {
    showMonth(1)
  }

  return (
    <>
      <div className="@container/calendar-screen relative z-10 flex min-h-dvh w-full items-start justify-center md:min-h-screen">
        <div className="dark:bg-calendar-paper-night @container m-2 grid h-[calc(100dvh-1rem)] min-h-min w-full max-w-[100rem] min-w-0 grid-cols-[minmax(0,1fr)] grid-rows-[auto_minmax(auto,1fr)_auto] content-start items-stretch justify-stretch gap-1.5 rounded bg-white p-2 pb-[calc(.5rem+env(safe-area-inset-bottom,0px))] text-black/85 shadow-sm md:m-6 md:flex md:h-auto md:min-h-0 md:flex-col md:items-center md:justify-center md:gap-0 md:p-4 @max-3xs/calendar-screen:flex @max-3xs/calendar-screen:h-auto @max-3xs/calendar-screen:min-h-[calc(100dvh-1rem)] @max-3xs/calendar-screen:flex-col @max-3xs/calendar-screen:justify-start dark:text-white">
          <header className="flex w-full flex-col md:grid md:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] md:items-center md:gap-4 md:py-5">
            <MonthNavigationButton
              direction="previous"
              placement="header"
              onClick={showPreviousMonth}
            />
            <h1
              className="min-w-0 text-center text-2xl font-bold wrap-anywhere text-gray-900 drop-shadow-lg max-md:leading-tight sm:text-4xl md:col-start-3 md:row-start-1 lg:text-5xl dark:text-gray-100"
              id="calendar-month-heading"
              aria-live="polite"
              aria-atomic="true"
            >
              {formatCalendarMonthHeading(visibleMonth)}
            </h1>
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 md:contents">
              <div className="h-11 w-20 justify-self-start sm:w-28 md:col-start-2 md:row-start-1 lg:w-36">
                <ToggleDarkMode />
              </div>
              <div className="justify-self-end md:col-start-4 md:row-start-1">
                <ToggleShowHours />
              </div>
            </div>
            <MonthNavigationButton
              direction="next"
              placement="header"
              onClick={showNextMonth}
            />
          </header>
          <CalendarGrid
            activeDate={activeDate}
            actualToday={actualToday}
            onActiveDateChange={setActiveDate}
            onVisibleMonthChange={setVisibleMonth}
            visibleMonth={visibleMonth}
          />
          <div className="flex w-full flex-wrap items-center justify-end gap-x-2 gap-y-1.5 md:mt-3 md:flex-nowrap md:justify-start md:gap-3">
            <StorageStatus />
            <AddReminderFab />
            <div
              role="group"
              aria-label="Month navigation"
              className="flex items-center gap-0.5 md:hidden"
            >
              <MonthNavigationButton
                direction="previous"
                placement="actions"
                onClick={showPreviousMonth}
              />
              <MonthNavigationButton
                direction="next"
                placement="actions"
                onClick={showNextMonth}
              />
            </div>
          </div>
        </div>
        {agendaIsOpen ? <AgendaDay /> : null}
        {addReminderIsOpen ? <AddReminder /> : null}
      </div>
      <div aria-hidden="true" className="fixed inset-0 z-0 h-full w-full">
        <Image
          src={calendarBackground}
          alt=""
          fill
          className="object-cover"
          placeholder="blur"
          sizes="100vw"
        />
        <div className="absolute inset-0 z-0 h-full w-full opacity-0 backdrop-brightness-50 backdrop-filter transition-all duration-500 dark:bg-[rgba(0,0,0,0.3)] dark:opacity-100"></div>
      </div>
    </>
  )
}
