export function normalize(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
}

export function generateSearchKey(customerName: string, plate: string): string {
  const firstName = customerName.trim().split(/\s+/)[0] ?? ""
  return `${normalize(firstName)}:${normalize(plate)}`
}
