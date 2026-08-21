import type { GetStaticProps, InferGetStaticPropsType } from "next"
import NextIndexWrapper from "@/components/NextIndexWrapper"

const CURRENT_DATE_REVALIDATION_SECONDS = 60 * 60

type PageProps = {
  initialCurrentDateKey: string
}

export const getStaticProps = (() => ({
  props: {
    initialCurrentDateKey: new Date().toISOString().slice(0, 10),
  },
  revalidate: CURRENT_DATE_REVALIDATION_SECONDS,
})) satisfies GetStaticProps<PageProps>

export default function Page({
  initialCurrentDateKey,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return <NextIndexWrapper initialCurrentDateKey={initialCurrentDateKey} />
}
