import { SvgIconTypeMap } from "@mui/material"
import IconButton from "@mui/material/IconButton"
import { OverridableComponent } from "@mui/material/OverridableComponent"

type MUIIcon = OverridableComponent<
  SvgIconTypeMap<Record<string, unknown>, "svg">
> & {
  muiName: string
}

export default function CustomIcon({
  ariaLabel,
  onClick,
  color,
  Icon,
  size = "large",
}: {
  ariaLabel: string
  onClick: () => void
  color: "blue" | "gray"
  Icon: MUIIcon
  size?: "small" | "large"
}) {
  const classNames = (...classes: string[]) => classes.join(" ")
  return (
    <IconButton
      aria-label={ariaLabel}
      title={ariaLabel}
      className={classNames(
        "border border-solid fill-current transition-all duration-500",
        size === "small" ? "h-8 w-8" : "h-12 w-12 sm:h-14 sm:w-14",
        "dark:bg-opacity-80 bg-gray-100",
        color === "blue"
          ? "border-blue-300 text-blue-500 hover:border-blue-500 hover:bg-blue-300 hover:text-blue-700"
          : "border-gray-300 text-gray-500 hover:border-gray-500 hover:bg-gray-300 hover:text-gray-700",
      )}
      onClick={onClick}
    >
      {<Icon className={size === "small" ? "h-6 w-6" : "h-9 w-9 sm:h-11 sm:w-11"} />}
    </IconButton>
  )
}
