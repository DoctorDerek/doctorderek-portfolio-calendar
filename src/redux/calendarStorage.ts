import { getErrorMessage } from "@/utils/errorUtils"

export type CalendarStorage = Pick<Storage, "getItem" | "setItem">

export type CalendarStorageFailure = {
  status: "failure"
  errorMessage: string
}

export const resolveCalendarStorage = (
  calendarStorage: CalendarStorage | undefined,
):
  | { status: "success"; calendarStorage: CalendarStorage }
  | CalendarStorageFailure => {
  if (calendarStorage) return { status: "success", calendarStorage }
  if (typeof window === "undefined") {
    return {
      status: "failure",
      errorMessage: "Browser storage is unavailable",
    }
  }

  try {
    return { status: "success", calendarStorage: window.localStorage }
  } catch (error: unknown) {
    return { status: "failure", errorMessage: getErrorMessage(error) }
  }
}

