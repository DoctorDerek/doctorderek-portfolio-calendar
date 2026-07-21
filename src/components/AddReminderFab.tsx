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
  position: "static" | "absolute"
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
        "h-14 w-14 bg-green-600 fill-current text-white hover:bg-green-800 sm:h-16 sm:w-16",
        position === "absolute"
          ? "absolute right-4 bottom-4"
          : "static shrink-0",
      )}
      onClick={onFabAddClick}
    >
      <AddIcon className="h-9 w-9 sm:h-12 sm:w-12" />
    </Fab>
  )
}
