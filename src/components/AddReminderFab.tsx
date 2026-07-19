import AddIcon from "@mui/icons-material/Add"
import { Fab } from "@mui/material"
import dayjs from "dayjs"
import { openAddReminder } from "@/redux/addReminderSlice"
import { useAppDispatch } from "@/redux/hooks"

const classNames = (...classes: string[]) => classes.join(" ")
const formatDateAgenda = (date: Date) => dayjs(date).format("MMMM D, YYYY")

export default function AddReminderFab({
  date,
  position,
}: {
  date?: Date | null
  position: "fixed" | "absolute"
}) {
  const dispatch = useAppDispatch()
  const onFabAddClick = () => {
    dispatch(openAddReminder((date ?? new Date()).toISOString()))
  }

  const ariaLabel =
    "Add Reminder" + (date ? ` for ${formatDateAgenda(date)}` : "")

  return (
    <Fab
      aria-label={ariaLabel}
      className={classNames(
        "right-4 bottom-4 h-16 w-16 bg-green-600 fill-current text-white hover:bg-green-800",
        position,
      )}
      onClick={onFabAddClick}
    >
      <AddIcon className="h-12 w-12" />
    </Fab>
  )
}
