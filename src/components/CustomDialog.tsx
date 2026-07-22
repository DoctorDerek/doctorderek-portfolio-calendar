import CloseIcon from "@mui/icons-material/Close"
import { Dialog, DialogContent, DialogTitle, Divider } from "@mui/material"
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
  children: React.ReactNode
}) {
  const id = title.replace(/\W/g, "-")
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={id}
      fullWidth={true}
      maxWidth="md"
      PaperProps={{
        classes: {
          root: "m-4 max-h-[calc(100%-2rem)] rounded-2xl bg-gray-100 dark:bg-gray-900 sm:m-8 sm:max-h-[calc(100%-4rem)]",
        },
      }}
    >
      <DialogTitle
        id={id}
        className="flex items-center justify-between gap-3 rounded-t-2xl px-4 py-3 text-2xl text-gray-900 sm:px-6 sm:py-4 sm:text-4xl dark:text-gray-100"
      >
        {title}
        <CustomIcon
          ariaLabel={`Close ${title}`}
          color="gray"
          onClick={onClose}
          Icon={CloseIcon}
        />
      </DialogTitle>
      <Divider className="bg-gray-200 dark:hidden" />
      <Divider className="hidden bg-gray-400 dark:block" />
      <DialogContent className="flex flex-col gap-4 px-4 py-4 text-base text-gray-900 sm:gap-6 sm:px-6 sm:py-5 sm:text-xl dark:text-gray-100">
        {children}
      </DialogContent>
    </Dialog>
  )
}
