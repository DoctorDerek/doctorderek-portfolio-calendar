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
      className="static h-14 w-14 shrink-0 bg-green-600 fill-current text-white hover:bg-green-800 sm:h-16 sm:w-16"
      onClick={onFabAddClick}
    >
      <AddIcon className="h-9 w-9 sm:h-12 sm:w-12" />
    </Fab>
  )
}

