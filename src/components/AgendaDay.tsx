import CloseIcon from "@mui/icons-material/Close"
import { Typography } from "@mui/material"
import dayjs from "dayjs"
import AddReminderFab from "@/components/AddReminderFab"
import CustomDialog from "@/components/CustomDialog"
import CustomIcon from "@/components/CustomIcon"
import { closeAgenda } from "@/redux/agendaSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { deleteReminder } from "@/redux/remindersSlice"
import type { Reminder, ReminderColor } from "@/reminderTypes"

const formatDateAgenda = (date: Date) => dayjs(date).format("MMMM D, YYYY")
const formatTimePicker = (date: Date) => dayjs(date).format("h:mm A")

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

  return (
    <CustomDialog title={dialogTitle} open={agendaIsOpen} onClose={onClose}>
      <div className="flex flex-col space-y-1">
        {agendaReminders.map((reminder) => (
          <AgendaReminder
            key={reminder.id}
            reminder={reminder}
            onDeleteReminder={deleteReminderOnClick}
          />
        ))}
        {agendaReminders.length === 0 && "No reminders yet."}
      </div>
      <AddReminderFab date={date} position="absolute" />
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
  return (
    <Typography>
      <div
        className="flex items-center justify-between rounded-3xl py-0.5 pr-2 pl-3 text-3xl dark:hidden"
        style={{ backgroundColor: color }}
      >
        <ReminderInterior
          color={color}
          text={text}
          time={time}
          onDelete={() => onDeleteReminder(id)}
        />
      </div>
      <div
        className="hidden items-center justify-between rounded-3xl border border-solid py-0.5 pr-1 pl-2 text-3xl dark:flex"
        style={{ borderColor: color }}
      >
        <ReminderInterior
          color={color}
          text={text}
          time={time}
          onDelete={() => onDeleteReminder(id)}
        />
      </div>
    </Typography>
  )
}

function ReminderInterior({
  color,
  text,
  time,
  onDelete,
}: {
  color: ReminderColor
  text: string
  time: string
  onDelete: () => void
}) {
  return (
    <>
      <div className="flex items-center justify-center">
        <div
          className="mr-2 hidden h-4 w-4 rounded-full dark:block"
          style={{ backgroundColor: color }}
        />
        <span className="mr-2 font-medium">{time}</span>
        <span>{text}</span>
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
