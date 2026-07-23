import Alert from "@mui/material/Alert"
import { useAppSelector } from "@/redux/hooks"

export default function StorageStatus() {
  const { failureMessages } = useAppSelector(
    ({ storageStatus }) => storageStatus,
  )
  const message =
    failureMessages.reminders ?? failureMessages.displayPreference ?? null
  if (!message) return null

  return (
    <Alert
      aria-atomic="true"
      className="flex-1"
      role="status"
      severity="warning"
    >
      {message}
    </Alert>
  )
}

