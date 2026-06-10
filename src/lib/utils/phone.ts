export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9)}`
  }
  if (digits.length === 12) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 8)}-${digits.slice(8)}`
  }
  return phone
}

export function toInternationalFormat(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 11) return `+55${digits}`
  if (digits.length === 10) return `+55${digits}`
  if (digits.startsWith("55") && digits.length >= 12) return `+${digits}`
  return phone
}
