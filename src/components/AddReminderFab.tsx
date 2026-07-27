import AddIcon from "@mui/icons-material/Add"
import { Fab } from "@mui/material"
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
    <Fab
      aria-label={ariaLabel}
      className="static h-14 shrink-0 gap-1 bg-green-600 fill-current px-4 text-white hover:bg-green-800 sm:h-16"
      onClick={onFabAddClick}
      variant="extended"
    >
      <AddIcon className="h-7 w-7 sm:h-9 sm:w-9" />
      Add Reminder
    </Fab>
  )
}
