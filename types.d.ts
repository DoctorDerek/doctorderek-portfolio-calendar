/// <reference types="react-scripts" />
declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}

type Color =
  | "DodgerBlue"
  | "Gray"
  | "LightGray"
  | "MediumSeaGreen"
  | "Orange"
  | "SlateBlue"
  | "Tomato"
  | "Violet"

type Reminder = {
  id: string
  dateISOString: string
  color: Color
  text: string
}
