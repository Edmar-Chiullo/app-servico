import { describe, it, expect } from "vitest"
import { formatPhone, toInternationalFormat } from "@/lib/utils/phone"

describe("formatPhone", () => {
  it("formats mobile with country code", () => {
    expect(formatPhone("+5511987654321")).toBe("+55 (11) 98765-4321")
  })

  it("formats landline with country code", () => {
    expect(formatPhone("+551112345678")).toBe("+55 (11) 1234-5678")
  })

  it("returns original when unknown format", () => {
    expect(formatPhone("123")).toBe("123")
  })
})

describe("toInternationalFormat", () => {
  it("converts 11-digit mobile to +55", () => {
    expect(toInternationalFormat("11987654321")).toBe("+5511987654321")
  })

  it("converts 10-digit landline to +55", () => {
    expect(toInternationalFormat("1123456789")).toBe("+551123456789")
  })

  it("keeps already formatted +55 number", () => {
    expect(toInternationalFormat("+5511987654321")).toBe("+5511987654321")
  })
})
