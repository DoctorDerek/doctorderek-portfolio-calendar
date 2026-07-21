import CloseIcon from "@mui/icons-material/Close"
import dayjs from "dayjs"
import type { CSSProperties } from "react"
import AddReminderFab from "@/components/AddReminderFab"
import CustomDialog from "@/components/CustomDialog"
import CustomIcon from "@/components/CustomIcon"
import { closeAgenda } from "@/redux/agendaSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { deleteReminder } from "@/redux/remindersSlice"
import type { Reminder, ReminderColor } from "@/reminderTypes"

const formatDateAgenda = (date: Date) => dayjs(date).format("MMMM D, YYYY")
const formatTimePicker = (date: Date) => dayjs(date).format("h:mm A")
type AgendaReminderColorStyle = CSSProperties & {
  "--agenda-reminder-color": ReminderColor
}

export default function AgendaDay() {
  const { agendaIsOpen, dateISOString } = useAppSelector(({ agenda }) => agenda)
  const date = dateISOString ? dayjs(dateISOString).toDate() : null

  const { reminders } = useAppSelector(({ reminders }) => reminders)
  const agendaReminders = reminders.filter((reminder) => {
    return date && dayjs(reminder.dateISOString).isSame(date, "day")
  })

  const dispatch = useAppDispatch()
  const onClose = () => {
    dispatch(closeAgenda())
  }
  const deleteReminderOnClick = (id: string) => {
    dispatch(deleteReminder(id))
  }

  const dialogTitle = date ? "Agenda: " + formatDateAgenda(date) : "Closing"
  const reminderListLabel = date
    ? "Reminders for " + formatDateAgenda(date)
    : "Reminders"

  return (
    <CustomDialog title={dialogTitle} open={agendaIsOpen} onClose={onClose}>
      {agendaReminders.length > 0 ? (
        <ul aria-label={reminderListLabel} className="flex flex-col space-y-1">
          {agendaReminders.map((reminder) => (
            <AgendaReminder
              key={reminder.id}
              reminder={reminder}
              onDeleteReminder={deleteReminderOnClick}
            />
          ))}
        </ul>
      ) : (
        <p role="status">No reminders yet.</p>
      )}
      <div className="flex justify-end pt-2">
        <AddReminderFab date={date} />
      </div>
    </CustomDialog>
  )
}

function AgendaReminder({
  reminder,
  onDeleteReminder,
}: {
  reminder: Reminder
  onDeleteReminder: (id: string) => void
}) {
  const { id, dateISOString, color, text } = reminder
  const time = formatTimePicker(dayjs(dateISOString).toDate())
  const reminderColorStyle: AgendaReminderColorStyle = {
    "--agenda-reminder-color": color,
  }
  return (
    <li
      className="flex items-start justify-between gap-2 rounded-2xl border-0 border-solid bg-[var(--agenda-reminder-color)] py-1 pr-2 pl-3 text-base sm:items-center sm:rounded-3xl sm:text-xl dark:border dark:border-[var(--agenda-reminder-color)] dark:bg-transparent dark:pr-1 dark:pl-2"
      style={reminderColorStyle}
    >
      <ReminderInterior
        text={text}
        time={time}
        onDelete={() => onDeleteReminder(id)}
      />
    </li>
  )
}

function ReminderInterior({
  text,
  time,
  onDelete,
}: {
  text: string
  time: string
  onDelete: () => void
}) {
  return (
    <>
      <div className="flex min-w-0 flex-wrap items-center">
        <div className="mr-2 hidden h-4 w-4 rounded-full bg-[var(--agenda-reminder-color)] dark:block" />
        <span className="mr-2 font-medium">{time}</span>
        <span className="min-w-0 break-words">{text}</span>
      </div>
      <CustomIcon
        ariaLabel={`Delete reminder ${time} ${text}`}
        onClick={onDelete}
        color="gray"
        size="small"
        Icon={CloseIcon}
      />
    </>
  )
}
