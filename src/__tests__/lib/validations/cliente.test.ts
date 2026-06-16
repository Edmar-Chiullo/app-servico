import { describe, it, expect } from "vitest"
import { clienteSchema } from "@/lib/validations"

describe("clienteSchema", () => {
  it("accepts valid cliente data", () => {
    const result = clienteSchema.safeParse({
      name: "João Silva",
      cpf: "52998224725",
      phone: "+5511987654321",
      whatsapp: "+5511987654321",
      email: "joao@email.com",
      street: "Rua A",
      number: "123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310100",
      active: true,
    })
    expect(result.success).toBe(true)
  })

  it("rejects missing name", () => {
    const result = clienteSchema.safeParse({
      phone: "+5511987654321",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined()
    }
  })

  it("accepts data without CPF", () => {
    const result = clienteSchema.safeParse({
      name: "João Silva",
      phone: "+5511987654321",
    })
    expect(result.success).toBe(true)
  })

  it("accepts data without phone", () => {
    const result = clienteSchema.safeParse({
      name: "João Silva",
    })
    expect(result.success).toBe(true)
  })

  it("accepts minimal data (name only)", () => {
    const result = clienteSchema.safeParse({
      name: "João Silva",
    })
    expect(result.success).toBe(true)
  })

  it("defaults active to true", () => {
    const result = clienteSchema.parse({
      name: "João",
    })
    expect(result.active).toBe(true)
  })
})
