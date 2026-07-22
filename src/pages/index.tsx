import dynamic from "next/dynamic"

const NextIndexWrapper = dynamic(
  () => import("@/components/NextIndexWrapper"),
  { ssr: false },
)

export default function Page() {
  return <NextIndexWrapper />
}
