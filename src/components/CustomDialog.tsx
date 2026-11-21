import { useId, useLayoutEffect, useRef, type ReactNode } from "react"
import CustomIcon from "@/components/CustomIcon"

export default function CustomDialog({
  title,
  open,
  onClose,
  children,
}: {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const titleId = useId()
  const ref = useRef<HTMLDialogElement>(null)
  useLayoutEffect(() => {
    const dialog = ref.current!
    if (open) dialog.showModal()
    return () => dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="dark:bg-calendar-dialog-night reminder-fit:max-h-[calc(100dvh---spacing(4))] reminder-fit:w-[calc(100%---spacing(4))] m-auto max-h-[calc(100dvh-min(4rem,12dvh))] w-[calc(100%-min(4rem,16vw))] max-w-[56.25rem] min-w-0 overflow-y-auto rounded bg-white p-0 text-black/85 shadow-2xl backdrop:bg-black/50 dark:text-white"
    >
      <div className="reminder-fit:py-2 flex flex-wrap-reverse items-center justify-end gap-3 border-b border-gray-200 px-[min(--spacing(6),6vw)] py-4 dark:border-gray-400">
        <h2
          id={titleId}
          className="min-w-0 grow basis-40 text-xl font-medium wrap-anywhere"
        >
          {title}
        </h2>
        <CustomIcon
          ariaLabel={`Close ${title}`}
          onClick={onClose}
          icon="close"
        />
      </div>
      <div className="reminder-fit:px-4 reminder-fit:py-3 flex min-w-0 flex-col gap-4 px-[min(--spacing(6),6vw)] py-5 text-base wrap-anywhere sm:gap-6 sm:text-xl">
        {children}
      </div>
    </dialog>
  )
}
