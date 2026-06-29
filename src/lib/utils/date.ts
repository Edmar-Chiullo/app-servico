const BRAZIL_OFFSET_HOURS = 3

function getBrazilDateComponents() {
  const now = new Date()
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  const [year, month, day] = fmt.format(now).split("-").map(Number)
  const dayOfWeek = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return { year, month, day, dayOfWeek }
}

export function getBrazilDayRange() {
  const { year, month, day } = getBrazilDateComponents()
  const startOfDay = new Date(Date.UTC(year, month - 1, day, BRAZIL_OFFSET_HOURS, 0, 0, 0))
  const endOfDay = new Date(Date.UTC(year, month - 1, day + 1, BRAZIL_OFFSET_HOURS, 0, 0, 0))
  return { startOfDay, endOfDay }
}

export function getBrazilWeekRange() {
  const { year, month, day, dayOfWeek } = getBrazilDateComponents()
  const startOfWeek = new Date(Date.UTC(year, month - 1, day - dayOfWeek, BRAZIL_OFFSET_HOURS, 0, 0, 0))
  return { startOfWeek }
}

export function getBrazilMonthRange() {
  const { year, month } = getBrazilDateComponents()
  const startOfMonth = new Date(Date.UTC(year, month - 1, 1, BRAZIL_OFFSET_HOURS, 0, 0, 0))
  return { startOfMonth }
}

export function formatDateBR(date: Date | string, style: "date" | "datetime" = "date"): string {
  const d = typeof date === "string" ? new Date(date) : date
  const fmt = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    ...(style === "datetime"
      ? { dateStyle: "short" as const, timeStyle: "short" as const }
      : { dateStyle: "short" as const }),
  })
  return fmt.format(d)
}
