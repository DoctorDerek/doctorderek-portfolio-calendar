import AddIcon from "@mui/icons-material/Add"
import { Fab } from "@mui/material"
import dayjs from "dayjs"
import { openAddReminder } from "@/src/redux/addReminderSlice"
import { useAppDispatch } from "@/src/redux/hooks"

const classNames = (...classes: string[]) => classes.join(" ")
const formatDateAgenda = (date: Date) => dayjs(date).format("MMMM D, YYYY")

/**
 * The FAB is the floating button that allows the user to add a new reminder.
 * It optionally takes a "date" prop when called from <AgendaDay> in order to
 * provide a better aria-label with the selected date from the open agenda.
 */
export default function AddReminderFab({
  date,
  position,
}: {
  date?: Date | null
  position: "fixed" | "absolute"
}) {
  const dispatch = useAppDispatch()
  const onFabAddClick = () => {
    dispatch(openAddReminder())
  }

  const ariaLabel =
    "Add Reminder" + (date ? ` for ${formatDateAgenda(date as Date)}` : "")

  return (
    <Fab
      aria-label={ariaLabel}
      className={classNames(
        "bottom-4 right-4 h-16 w-16 bg-green-600 fill-current text-white hover:bg-green-800",
        position,
      )}
      onClick={onFabAddClick}
    >
      {/* note: sizes here should be the same as in <CustomIcon> */}
      <AddIcon className="h-12 w-12" />
    </Fab>
  )
}
