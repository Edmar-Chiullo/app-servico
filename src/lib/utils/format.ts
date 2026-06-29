export function formatCurrency(value: number | string | { toString(): string }): string {
  const num = typeof value === "number" ? value : Number(value)
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num)
}

import { formatDateBR } from "./date"

export function formatDate(date: Date | string): string {
  return formatDateBR(date, "date")
}

export function formatDateTime(date: Date | string): string {
  return formatDateBR(date, "datetime")
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(value)
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural
}

export function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}
