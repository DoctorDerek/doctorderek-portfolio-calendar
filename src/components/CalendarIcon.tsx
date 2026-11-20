const paths = {
  add: "M12 5v14M5 12h14",
  alarm: "M6 3 2 7m16-4 4 4M12 8v5l3 2m5-2a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
  check: "m4 12 5 5L20 6",
  clock: "M12 6v6l4 3m6-3a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  close: "m6 6 12 12M18 6 6 18",
  next: "m9 5 7 7-7 7",
  previous: "m15 5-7 7 7 7",
}

export type CalendarIconName = keyof typeof paths

export default function CalendarIcon({
  name,
  className,
}: {
  name: CalendarIconName
  className: string
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  )
}
