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
  color: "blue" | "gray" | "purple"
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
        size === "small" ? "h-8 w-8" : "h-16 w-16",
        "dark:bg-opacity-80 bg-gray-100",
        (color === "blue" &&
          "border-blue-300 text-blue-500 hover:border-blue-500 hover:bg-blue-300 hover:text-blue-700") as string,
        (color === "gray" &&
          "border-gray-300 text-gray-500 hover:border-gray-500 hover:bg-gray-300 hover:text-gray-700") as string,
        (color === "purple" &&
          "border-purple-300 text-purple-500 hover:border-purple-500 hover:bg-purple-300 hover:text-purple-700") as string,
      )}
      onClick={onClick}
    >
      {<Icon className={size === "small" ? "h-6 w-6" : "h-12 w-12"} />}
    </IconButton>
  )
}
