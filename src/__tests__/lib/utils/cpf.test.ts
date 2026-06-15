import { describe, it, expect } from "vitest"
import { isValidCPF, formatCPF } from "@/lib/utils/cpf"

describe("isValidCPF", () => {
  it("returns true for a valid CPF", () => {
    expect(isValidCPF("52998224725")).toBe(true)
  })

  it("returns true ignoring formatting", () => {
    expect(isValidCPF("529.982.247-25")).toBe(true)
  })

  it("returns false for all same digits", () => {
    expect(isValidCPF("11111111111")).toBe(false)
  })

  it("returns false for short input", () => {
    expect(isValidCPF("123456789")).toBe(false)
  })

  it("returns false for invalid check digits", () => {
    expect(isValidCPF("52998224726")).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(isValidCPF("")).toBe(false)
  })
})

describe("formatCPF", () => {
  it("formats 11 digits correctly", () => {
    expect(formatCPF("52998224725")).toBe("529.982.247-25")
  })

  it("strips non-digits before formatting", () => {
    expect(formatCPF("529.982.247-25")).toBe("529.982.247-25")
  })
})
