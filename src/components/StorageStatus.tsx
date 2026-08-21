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
    <div
      aria-atomic="true"
      className="flex-1 rounded-lg border border-amber-500 bg-amber-100/95 px-3 py-2 text-sm font-medium text-amber-950 shadow-sm dark:border-amber-400 dark:bg-amber-950/95 dark:text-amber-100"
      role="status"
    >
      {messages.join(" ")}
    </div>
  )
}
