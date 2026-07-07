import dayjs from "dayjs"

import AddReminderFab from "@/src/components/AddReminderFab"
import CustomDialog from "@/src/components/CustomDialog"
import CustomIcon from "@/src/components/CustomIcon"
import { closeAgenda } from "@/src/redux/agendaSlice"
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks"
import { deleteReminder } from "@/src/redux/remindersSlice"
import { Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"

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
        {agendaReminders.map(({ id, dateISOString, color, text }) => {
          const time = formatTimePicker(dayjs(dateISOString).toDate())
          return (
            <Typography key={id}>
              <div
                className="dark:hidden py-0.5 pl-3 pr-2 rounded-3xl flex items-center justify-between text-3xl"
                style={{ backgroundColor: color }}
              >
                <ReminderInterior />
              </div>
              <div
                className="hidden py-0.5 pl-2 pr-1 rounded-3xl dark:flex items-center justify-between text-3xl border-1 border-solid"
                style={{ borderColor: color }}
              >
                <ReminderInterior />
              </div>
            </Typography>
          )

          function ReminderInterior() {
            return (
              <>
                <div className="flex items-center justify-center">
                  <div
                    className="hidden w-4 h-4 mr-2 rounded-full dark:block"
                    style={{ backgroundColor: color }}
                  />
                  <span className="mr-2 font-medium">{time}</span>
                  <span>{text}</span>
                </div>
                <CustomIcon
                  ariaLabel={`Delete reminder ${time} ${text}`}
                  onClick={() => deleteReminderOnClick(id)}
                  color="gray"
                  size="small"
                  Icon={CloseIcon}
                />
              </>
            )
          }
        })}
        {agendaReminders.length === 0 && "No reminders yet."}
      </div>
      <AddReminderFab date={date} position="absolute" />
    </CustomDialog>
  )
}
