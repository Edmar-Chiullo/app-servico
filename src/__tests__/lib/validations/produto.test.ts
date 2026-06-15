import { describe, it, expect } from "vitest"
import { produtoSchema } from "@/lib/validations"
import { movimentacaoSchema } from "@/lib/validations/produto"

describe("produtoSchema", () => {
  it("accepts valid product data", () => {
    const result = produtoSchema.safeParse({
      code: "P001",
      description: "Óleo 5W30",
      category: "Lubrificante",
      unit: "LT",
      stockQuantity: 10,
      stockMin: 2,
      stockMax: 50,
      costPrice: 25.00,
      salePrice: 45.00,
      active: true,
    })
    expect(result.success).toBe(true)
  })

  it("rejects missing code", () => {
    const result = produtoSchema.safeParse({
      description: "Produto sem código",
    })
    expect(result.success).toBe(false)
  })

  it("rejects negative stock", () => {
    const result = produtoSchema.safeParse({
      code: "P001",
      description: "Teste",
      stockQuantity: -1,
    })
    expect(result.success).toBe(false)
  })

  it("defaults unit to UN", () => {
    const result = produtoSchema.parse({
      code: "P001",
      description: "Teste",
    })
    expect(result.unit).toBe("UN")
  })
})

describe("movimentacaoSchema", () => {
  it("accepts valid IN movement", () => {
    const result = movimentacaoSchema.safeParse({
      productId: "p1",
      type: "IN",
      quantity: 10,
      reason: "Compra de estoque",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid movement type", () => {
    const result = movimentacaoSchema.safeParse({
      productId: "p1",
      type: "INVALID",
      quantity: 10,
      reason: "Teste",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing reason", () => {
    const result = movimentacaoSchema.safeParse({
      productId: "p1",
      type: "OUT",
      quantity: 5,
    })
    expect(result.success).toBe(false)
  })
})
