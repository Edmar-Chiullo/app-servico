import { describe, it, expect } from "vitest"
import { veiculoSchema } from "@/lib/validations"

describe("veiculoSchema", () => {
  it("accepts valid vehicle with Mercosul plate", () => {
    const result = veiculoSchema.safeParse({
      plate: "ABC1D23",
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      color: "Preto",
      mileage: 50000,
      customerId: "some-id",
    })
    expect(result.success).toBe(true)
  })

  it("accepts valid vehicle with old plate", () => {
    const result = veiculoSchema.safeParse({
      plate: "ABC1234",
      model: "Gol",
      color: "Branco",
      customerId: "some-id",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid plate", () => {
    const result = veiculoSchema.safeParse({
      plate: "INVALID",
      model: "Gol",
      color: "Branco",
      customerId: "some-id",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing model", () => {
    const result = veiculoSchema.safeParse({
      plate: "ABC1D23",
      color: "Preto",
      customerId: "some-id",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing color", () => {
    const result = veiculoSchema.safeParse({
      plate: "ABC1D23",
      model: "Corolla",
      customerId: "some-id",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing customerId", () => {
    const result = veiculoSchema.safeParse({
      plate: "ABC1D23",
      model: "Corolla",
      color: "Preto",
    })
    expect(result.success).toBe(false)
  })
})
