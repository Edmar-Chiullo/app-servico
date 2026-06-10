export function isValidPlate(plate: string): boolean {
  const mercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/
  const oldStyle = /^[A-Z]{3}[0-9]{4}$/
  return mercosul.test(plate) || oldStyle.test(plate)
}

export function formatPlate(plate: string): string {
  return plate.toUpperCase().replace(/[^A-Z0-9]/g, "")
}
