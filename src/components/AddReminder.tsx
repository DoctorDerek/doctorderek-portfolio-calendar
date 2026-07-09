import CheckIcon from "@mui/icons-material/Check"
import { TextField } from "@mui/material"
import Typography from "@mui/material/Typography"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import dayjs, { Dayjs } from "dayjs"
import { useEffect, useState } from "react"
import CustomDialog from "@/src/components/CustomDialog"
import { closeAddReminder } from "@/src/redux/addReminderSlice"
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks"
import { addNewReminder } from "@/src/redux/remindersSlice"

const classNames = (...classes: string[]) => classes.join(" ")

const maskPicker = "MMMM D, YYYY h:mm A"
const formatDateAndTimePicker = (date: Dayjs) => date.format(maskPicker)

export default function AddReminder() {
  const { addReminderIsOpen } = useAppSelector(({ addReminder }) => addReminder)
  const { dateISOString } = useAppSelector(({ agenda }) => agenda)
  const date = dateISOString ? dayjs(dateISOString) : dayjs()
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(date)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedDateTime(dateISOString ? dayjs(dateISOString) : dayjs())
  }, [dateISOString])

  const [selectedColor, setSelectedColor] = useState<Color>("DodgerBlue")
  const [reminder, setReminder] = useState("")
  const [savingMessage, setSavingMessage] = useState("")
  const REMINDER_MAX_LENGTH = 30
  const remainingCharacters = REMINDER_MAX_LENGTH - reminder.length
  const handleReminderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newReminder = event.target.value
    setReminder(() => newReminder.slice(0, REMINDER_MAX_LENGTH))
    if (newReminder.length === 0) setSavingMessage(() => "")
    else if (newReminder.length < REMINDER_MAX_LENGTH) {
      setTimeout(() => {
        if (reminder) setSavingMessage(() => "Saving")
      }, 200)
      setTimeout(() => {
        if (reminder) setSavingMessage(() => "Saving.")
      }, 400)
      setTimeout(() => {
        if (reminder) setSavingMessage(() => "Saving..")
      }, 600)
      setTimeout(() => {
        if (reminder) setSavingMessage(() => "Saving...")
      }, 800)
      setTimeout(() => {
        if (reminder) setSavingMessage(() => "Saved!")
      }, 1000)
    }
  }

  const dispatch = useAppDispatch()
  const onClose = () => {
    dispatch(closeAddReminder())
    if (selectedDateTime && selectedColor && reminder) {
      dispatch(
        addNewReminder({
          id: "ID is generated automatically",
          dateISOString: selectedDateTime.toISOString(),
          color: selectedColor,
          text: reminder,
        }),
      )
    }
    setSelectedColor(() => "DodgerBlue")
    setReminder(() => "")
    setSavingMessage(() => "")
  }

  return (
    <CustomDialog
      title="Add Reminder"
      open={addReminderIsOpen}
      onClose={onClose}
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
            className={classNames(
              "flex justify-between text-3xl italic",
              remainingCharacters < 5 ? "text-red-600" : "text-gray-800",
            )}
          >
            {remainingCharacters} characters {reminder ? "remaining" : "max"}
          </span>
          <span className={"absolute right-20 top-6 text-4xl text-green-500"}>
            {savingMessage}
          </span>
        </Typography>
        <TextField
          inputProps={{
            className: "text-3xl bg-gray-200",
          }}
          fullWidth={true}
          value={reminder}
          onChange={handleReminderChange}
        />
      </div>
    </CustomDialog>
  )
}

function ColorPicker({
  selectedColor,
  handleChange,
}: {
  selectedColor: Color
  handleChange: React.Dispatch<React.SetStateAction<Color>>
}) {
  /** HTML colors for the color picker */
  const COLORS = [
    "DodgerBlue",
    "Gray",
    "LightGray",
    "MediumSeaGreen",
    "Orange",
    "SlateBlue",
    "Tomato",
    "Violet",
  ] as readonly Color[]

  return (
    <div className="space-y-2">
      <Typography className="text-3xl">
        Select a color for the reminder:
      </Typography>
      <div className="flex rounded border-1 border-solid border-gray-400 bg-gray-200">
        {COLORS.map((color) => (
          <button
            className={classNames(
              "m-4 h-16 w-16 rounded border-solid border-black",
              color === selectedColor ? "border-2" : "border-1",
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
