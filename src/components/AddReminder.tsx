import CheckIcon from "@mui/icons-material/Check"
import { Button, TextField } from "@mui/material"
import Typography from "@mui/material/Typography"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import dayjs, { Dayjs } from "dayjs"
import { useState } from "react"
import CustomDialog from "@/components/CustomDialog"
import { closeAddReminder } from "@/redux/addReminderSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addNewReminder } from "@/redux/remindersSlice"
import {
  REMINDER_COLORS,
  REMINDER_MAX_LENGTH,
  type ReminderColor,
} from "@/reminderTypes"

const classNames = (...classes: string[]) => classes.join(" ")
const REMINDER_CHARACTER_COUNT_ID = "reminder-character-count"

const maskPicker = "MMMM D, YYYY h:mm A"
const formatDateAndTimePicker = (date: Dayjs) => date.format(maskPicker)

export default function AddReminder() {
  const { addReminderIsOpen, dateISOString } = useAppSelector(
    ({ addReminder }) => addReminder,
  )
  if (!addReminderIsOpen) return null

  return <ReminderForm dateISOString={dateISOString} />
}

function ReminderForm({ dateISOString }: { dateISOString: string }) {
  const date = dateISOString ? dayjs(dateISOString) : dayjs()
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(date)
  const [selectedColor, setSelectedColor] =
    useState<ReminderColor>("DodgerBlue")
  const [reminder, setReminder] = useState("")
  const normalizedReminder = reminder.trim()
  const reminderCanBeSaved =
    selectedDateTime !== null && normalizedReminder.length > 0
  const remainingCharacters = REMINDER_MAX_LENGTH - reminder.length
  const handleReminderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newReminder = event.target.value
    setReminder(() => newReminder.slice(0, REMINDER_MAX_LENGTH))
  }

  const dispatch = useAppDispatch()
  const closeReminder = () => {
    dispatch(closeAddReminder())
  }
  const saveReminder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedDateTime || !normalizedReminder) return

    dispatch(
      addNewReminder({
        dateISOString: selectedDateTime.toISOString(),
        color: selectedColor,
        text: normalizedReminder,
      }),
    )
    dispatch(closeAddReminder())
  }

  return (
    <CustomDialog title="Add Reminder" open={true} onClose={closeReminder}>
      <form
        aria-label="Reminder details"
        className="flex flex-col space-y-6"
        onSubmit={saveReminder}
      >
        <div className="space-y-2">
          <Typography className="text-3xl">
            Select the date and time for the reminder:
          </Typography>
          <div className="w-full text-3xl">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                value={selectedDateTime}
                onChange={setSelectedDateTime}
                slotProps={{
                  textField: {
                    className: "text-3xl bg-gray-200",
                    fullWidth: true,
                    inputProps: {
                      "aria-label": `Choose date and time, selected date and time is ${
                        selectedDateTime
                          ? formatDateAndTimePicker(selectedDateTime)
                          : ""
                      }`,
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
        <ColorPicker
          selectedColor={selectedColor}
          handleChange={setSelectedColor}
        />
        <div className="space-y-2">
          <Typography className="flex justify-between text-3xl">
            Enter your reminder here:
            <span
              aria-live="polite"
              className={classNames(
                "flex justify-between text-3xl italic",
                remainingCharacters < 5 ? "text-red-600" : "text-gray-800",
              )}
              id={REMINDER_CHARACTER_COUNT_ID}
            >
              {remainingCharacters} characters {reminder ? "remaining" : "max"}
            </span>
          </Typography>
          <TextField
            inputProps={{
              "aria-describedby": REMINDER_CHARACTER_COUNT_ID,
              "aria-label": "Reminder",
              className: "text-3xl bg-gray-200",
            }}
            fullWidth={true}
            value={reminder}
            onChange={handleReminderChange}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button color="inherit" onClick={closeReminder} type="button">
            Cancel
          </Button>
          <Button
            color="success"
            disabled={!reminderCanBeSaved}
            type="submit"
            variant="contained"
          >
            Save Reminder
          </Button>
        </div>
      </form>
    </CustomDialog>
  )
}

function ColorPicker({
  selectedColor,
  handleChange,
}: {
  selectedColor: ReminderColor
  handleChange: React.Dispatch<React.SetStateAction<ReminderColor>>
}) {
  return (
    <div aria-label="Reminder color" className="space-y-2" role="group">
      <Typography className="text-3xl">
        Select a color for the reminder:
      </Typography>
      <div className="flex rounded border border-solid border-gray-400 bg-gray-200">
        {REMINDER_COLORS.map((color) => (
          <button
            type="button"
            className={classNames(
              "m-4 h-16 w-16 rounded border-solid border-black",
              color === selectedColor ? "border-2" : "border",
            )}
            key={color}
            onClick={() => handleChange(color)}
            style={{ backgroundColor: color }}
            aria-label={
              (color === selectedColor ? "Selected color is" : "Select color") +
              ` ${color}`
            }
          >
            {color === selectedColor ? (
              <CheckIcon
                aria-label={color + " is selected"}
                className="h-12 w-12"
              />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}
