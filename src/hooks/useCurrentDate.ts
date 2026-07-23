import { useEffect, useState } from "react"

const getMillisecondsUntilNextLocalDate = (currentDate: Date) => {
  const nextLocalDate = new Date(currentDate)
  nextLocalDate.setHours(24, 0, 0, 0)
  return nextLocalDate.getTime() - currentDate.getTime()
}

export default function useCurrentDate() {
  const [currentDate, setCurrentDate] = useState(() => new Date())

  useEffect(() => {
    let nextLocalDateTimer: ReturnType<typeof setTimeout>

    const scheduleNextLocalDate = () => {
      const now = new Date()
      nextLocalDateTimer = setTimeout(
        refreshCurrentDate,
        getMillisecondsUntilNextLocalDate(now),
      )
    }

    const refreshCurrentDate = () => {
      clearTimeout(nextLocalDateTimer)
      setCurrentDate(new Date())
      scheduleNextLocalDate()
    }

    const refreshCurrentDateWhenVisible = () => {
      if (document.visibilityState === "visible") refreshCurrentDate()
    }

    scheduleNextLocalDate()
    window.addEventListener("focus", refreshCurrentDate)
    document.addEventListener("visibilitychange", refreshCurrentDateWhenVisible)

    return () => {
      clearTimeout(nextLocalDateTimer)
      window.removeEventListener("focus", refreshCurrentDate)
      document.removeEventListener(
        "visibilitychange",
        refreshCurrentDateWhenVisible,
      )
    }
  }, [])

  return currentDate
}

