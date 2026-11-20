import CalendarIcon from "@/components/CalendarIcon"
import { openAddReminder } from "@/redux/addReminderSlice"
import { useAppDispatch } from "@/redux/hooks"
import { formatCalendarDate } from "@/utils/dateUtils"

export default function AddReminderFab({ date }: { date?: Date | null }) {
  const dispatch = useAppDispatch()
  const onFabAddClick = () => {
    dispatch(openAddReminder((date ?? new Date()).toISOString()))
  }

  const ariaLabel =
    "Add Reminder" + (date ? ` for ${formatCalendarDate(date)}` : "")

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="bg-calendar-action inline-flex min-h-14 max-w-full min-w-0 shrink-0 cursor-pointer items-center justify-center gap-1 rounded-full px-4 py-3 text-sm font-medium tracking-wide text-black/85 uppercase shadow-md hover:bg-neutral-300 sm:min-h-16"
      onClick={onFabAddClick}
    >
      <CalendarIcon name="add" className="size-6" />
      Add Reminder
    </button>
  )
}
