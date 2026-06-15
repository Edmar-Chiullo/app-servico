import { describe, it, expect } from "vitest"
import { isValidPlate, formatPlate } from "@/lib/utils/plate"

describe("isValidPlate", () => {
  it("accepts Mercosul format (ABC1D23)", () => {
    expect(isValidPlate("ABC1D23")).toBe(true)
  })

  it("accepts old format (ABC1234)", () => {
    expect(isValidPlate("ABC1234")).toBe(true)
  })

  it("rejects invalid format", () => {
    expect(isValidPlate("ABCD123")).toBe(false)
  })

  it("rejects lowercase", () => {
    expect(isValidPlate("abc1d23")).toBe(false)
  })

  it("rejects empty string", () => {
    expect(isValidPlate("")).toBe(false)
  })
})

describe("formatPlate", () => {
  it("uppercases and strips special chars", () => {
    expect(formatPlate("abc-1d23")).toBe("ABC1D23")
  })

  it("returns clean plate as-is", () => {
    expect(formatPlate("ABC1234")).toBe("ABC1234")
  })
})
