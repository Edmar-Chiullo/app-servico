export function isValidCNPJ(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, "")

  if (numbers.length !== 14) return false
  if (/^(\d)\1{13}$/.test(numbers)) return false

  let length = numbers.length - 2
  let numbersWithoutDigits = numbers.substring(0, length)
  const digits = numbers.substring(length)
  let sum = 0
  let pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbersWithoutDigits.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(0))) return false

  length += 1
  numbersWithoutDigits = numbers.substring(0, length)
  sum = 0
  pos = length - 7

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbersWithoutDigits.charAt(length - i)) * pos--
    if (pos < 2) pos = 9
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (result !== parseInt(digits.charAt(1))) return false

  return true
}

export function formatCNPJ(cnpj: string): string {
  const numbers = cnpj.replace(/\D/g, "")
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
}
