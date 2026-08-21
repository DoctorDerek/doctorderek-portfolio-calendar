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
const subscribeToInitialCurrentDate = () => () => undefined

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

export default function useCurrentDate(initialCurrentDateKey?: string) {
  const initialLocalDateKey = useMemo(
    () => initialCurrentDateKey ?? getCurrentLocalDateKey(),
    [initialCurrentDateKey],
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

export function useInitialCurrentDate(initialCurrentDateKey?: string) {
  const browserInitialLocalDateKey = useMemo(() => getCurrentLocalDateKey(), [])
  const serverInitialLocalDateKey =
    initialCurrentDateKey ?? browserInitialLocalDateKey
  const getBrowserInitialLocalDateKey = useCallback(
    () => browserInitialLocalDateKey,
    [browserInitialLocalDateKey],
  )
  const getServerInitialLocalDateKey = useCallback(
    () => serverInitialLocalDateKey,
    [serverInitialLocalDateKey],
  )
  const initialLocalDateKey = useSyncExternalStore(
    subscribeToInitialCurrentDate,
    getBrowserInitialLocalDateKey,
    getServerInitialLocalDateKey,
  )

  return useMemo(
    () => parseLocalDateKey(initialLocalDateKey),
    [initialLocalDateKey],
  )
}
