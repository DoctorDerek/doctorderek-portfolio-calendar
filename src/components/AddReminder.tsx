import dayjs from "dayjs"
import { useState } from "react"
import CalendarIcon from "@/components/CalendarIcon"
import CustomDialog from "@/components/CustomDialog"
import { closeAddReminder } from "@/redux/addReminderSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addNewReminder } from "@/redux/remindersSlice"
import {
  REMINDER_COLORS,
  REMINDER_MAX_LENGTH,
  reminderColorClass,
  type ReminderColor,
} from "@/reminderTypes"
import combineClassNames from "@/utils/combineClassNames"

const REMINDER_CHARACTER_COUNT_ID = "reminder-character-count"

export default function AddReminder() {
  const { addReminderIsOpen, dateISOString } = useAppSelector(
    ({ addReminder }) => addReminder,
  )
  if (!addReminderIsOpen) return null

  return <ReminderForm dateISOString={dateISOString} />
}

function ReminderForm({ dateISOString }: { dateISOString: string }) {
  const [selectedDateTime, setSelectedDateTime] = useState(() =>
    dayjs(dateISOString || undefined).format("YYYY-MM-DDTHH:mm"),
  )
  const [selectedColor, setSelectedColor] =
    useState<ReminderColor>("DodgerBlue")
  const [reminder, setReminder] = useState("")
  const normalizedReminder = reminder.trim()
  const reminderCanBeSaved =
    selectedDateTime !== "" && normalizedReminder.length > 0
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
        dateISOString: dayjs(selectedDateTime).toISOString(),
        color: selectedColor,
        text: normalizedReminder,
      }),
    )
    dispatch(closeAddReminder())
  }

  return (
    <CustomDialog title="Add Reminder" open={true} onClose={closeReminder}>
      <form
        id="reminder-form"
        aria-label="Reminder details"
        className="reminder-fit:gap-3 flex min-w-0 flex-col gap-5 sm:gap-6"
        onSubmit={saveReminder}
      >
        <div className="space-y-2">
          <label
            htmlFor="reminder-date-time"
            className="block text-base font-medium sm:text-xl"
          >
            Date and time
          </label>
          <input
            id="reminder-date-time"
            type="datetime-local"
            required
            value={selectedDateTime}
            onChange={(event) => setSelectedDateTime(event.currentTarget.value)}
            className="block min-h-14 w-full min-w-0 rounded border border-gray-500 bg-transparent px-3 py-2 text-base sm:text-lg dark:scheme-dark"
          />
        </div>
        <ColorPicker
          selectedColor={selectedColor}
          handleChange={setSelectedColor}
        />
        <div className="space-y-2">
          <label
            htmlFor="reminder-text"
            className="flex flex-col gap-1 text-base font-medium sm:flex-row sm:items-end sm:justify-between sm:text-xl"
          >
            Enter your reminder here:
            <span
              aria-live="polite"
              className={combineClassNames(
                "text-sm font-normal italic sm:text-base",
                remainingCharacters < 5
                  ? "text-red-700 dark:text-red-300"
                  : "text-gray-700 dark:text-gray-300",
              )}
              id={REMINDER_CHARACTER_COUNT_ID}
            >
              {remainingCharacters} characters {reminder ? "remaining" : "max"}
            </span>
          </label>
          <input
            id="reminder-text"
            type="text"
            aria-label="Reminder"
            aria-describedby={REMINDER_CHARACTER_COUNT_ID}
            maxLength={REMINDER_MAX_LENGTH}
            className="block min-h-14 w-full rounded border border-gray-500 bg-transparent px-3 py-2 text-base sm:text-lg"
            value={reminder}
            onChange={handleReminderChange}
          />
        </div>
        <div className="reminder-fit:gap-2 flex flex-wrap justify-end gap-4">
          <button
            className="min-h-11 cursor-pointer rounded px-3 text-sm font-medium tracking-wide uppercase hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={closeReminder}
            type="button"
          >
            Cancel
          </button>
          <button
            className="min-h-11 cursor-pointer rounded bg-green-700 px-4 text-sm font-medium tracking-wide text-white uppercase hover:bg-green-800 disabled:cursor-default disabled:bg-black/10 disabled:text-black/40 dark:disabled:bg-white/10 dark:disabled:text-white/40"
            disabled={!reminderCanBeSaved}
            type="submit"
          >
            Save Reminder
          </button>
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
      <p className="text-base font-medium sm:text-xl">
        Select a color for the reminder:
      </p>
      <div className="grid grid-cols-4 gap-2 rounded border border-solid border-gray-400 bg-gray-200 p-2 sm:grid-cols-8 sm:gap-3 dark:bg-gray-800">
        {REMINDER_COLORS.map((color) => (
          <button
            type="button"
            aria-pressed={color === selectedColor}
            className={combineClassNames(
              reminderColorClass[color],
              "flex h-11 w-full min-w-0 cursor-pointer items-center justify-center rounded border-solid border-black bg-(--reminder-color) sm:h-12",
              color === selectedColor ? "border-2" : "border",
            )}
            key={color}
            onClick={() => handleChange(color)}
            aria-label={
              (color === selectedColor ? "Selected color is" : "Select color") +
              ` ${color}`
            }
          >
            {color === selectedColor ? (
              <CalendarIcon name="check" className="h-7 w-7 sm:h-8 sm:w-8" />
            ) : null}
          </button>
        ))}
      </div>
    </div>
  )
}
