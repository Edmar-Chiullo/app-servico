import { toTitleCase } from "@/lib/utils/format"

type Props = {
  children: string | null | undefined
  className?: string
}

export function FormattedText({ children, className }: Props) {
  if (!children) return null
  return <span className={className}>{toTitleCase(children)}</span>
}
