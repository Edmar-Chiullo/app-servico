import { describe, it, expect } from "vitest"
import { isValidCNPJ, formatCNPJ } from "@/lib/utils/cnpj"

describe("isValidCNPJ", () => {
  it("returns true for a valid CNPJ", () => {
    expect(isValidCNPJ("11444777000161")).toBe(true)
  })

  it("returns true ignoring formatting", () => {
    expect(isValidCNPJ("11.444.777/0001-61")).toBe(true)
  })

  it("returns false for all same digits", () => {
    expect(isValidCNPJ("11111111111111")).toBe(false)
  })

  it("returns false for short input", () => {
    expect(isValidCNPJ("123456789")).toBe(false)
  })

  it("returns false for invalid check digits", () => {
    expect(isValidCNPJ("11444777000162")).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(isValidCNPJ("")).toBe(false)
  })
})

describe("formatCNPJ", () => {
  it("formats 14 digits correctly", () => {
    expect(formatCNPJ("11444777000161")).toBe("11.444.777/0001-61")
  })
})
