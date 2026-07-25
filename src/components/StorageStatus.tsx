import Alert from "@mui/material/Alert"
import { useAppSelector } from "@/redux/hooks"

export default function StorageStatus() {
  const { failureMessages } = useAppSelector(
    ({ storageStatus }) => storageStatus,
  )
  const messages = [
    failureMessages.reminders,
    failureMessages.displayPreference,
  ].filter((message): message is string => message !== undefined)
  if (!messages.length) return null

  return (
    <Alert
      aria-atomic="true"
      className="flex-1"
      role="status"
      severity="warning"
    >
      {messages.join(" ")}
    </Alert>
  )
}
