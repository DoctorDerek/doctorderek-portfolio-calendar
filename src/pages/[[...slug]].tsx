import dynamic from "next/dynamic"

const NextIndexWrapper = dynamic(
  () => import("../components/NextIndexWrapper"),
  { ssr: false },
)

export default function Page(props: Record<string, unknown>) {
  return <NextIndexWrapper {...props} />
}
