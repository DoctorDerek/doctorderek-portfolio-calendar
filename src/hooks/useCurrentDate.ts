import { useCallback, useMemo, useSyncExternalStore } from "react"

const formatLocalDateKey = (date: Date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")

const parseLocalDateKey = (localDateKey: string) => {
  const [year, month, date] = localDateKey.split("-").map(Number) as [
    number,
    number,
    number,
  ]
  return new Date(year, month - 1, date)
}

const getCurrentLocalDateKey = () => formatLocalDateKey(new Date())

const getMillisecondsUntilNextLocalDate = (currentDate: Date) => {
  const nextLocalDate = new Date(currentDate)
  nextLocalDate.setHours(24, 0, 0, 0)
  return nextLocalDate.getTime() - currentDate.getTime()
}

const subscribeToCurrentDate = (notifyCurrentDateChange: () => void) => {
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
    notifyCurrentDateChange()
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
}

export default function useCurrentDate(initialCurrentDateISOString?: string) {
  const initialLocalDateKey = useMemo(
    () =>
      formatLocalDateKey(
        initialCurrentDateISOString
          ? new Date(initialCurrentDateISOString)
          : new Date(),
      ),
    [initialCurrentDateISOString],
  )
  const getInitialLocalDateKey = useCallback(
    () => initialLocalDateKey,
    [initialLocalDateKey],
  )
  const currentLocalDateKey = useSyncExternalStore(
    subscribeToCurrentDate,
    getCurrentLocalDateKey,
    getInitialLocalDateKey,
  )

  return useMemo(
    () => parseLocalDateKey(currentLocalDateKey),
    [currentLocalDateKey],
  )
}
