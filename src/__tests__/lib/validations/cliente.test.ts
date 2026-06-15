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
      cpf: "52998224725",
      phone: "+5511987654321",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toBeDefined()
    }
  })

  it("rejects invalid CPF format", () => {
    const result = clienteSchema.safeParse({
      name: "João",
      cpf: "123",
      phone: "+5511987654321",
    })
    expect(result.success).toBe(false)
  })

  it("rejects phone without +55", () => {
    const result = clienteSchema.safeParse({
      name: "João",
      cpf: "52998224725",
      phone: "11987654321",
    })
    expect(result.success).toBe(false)
  })

  it("accepts minimal valid data", () => {
    const result = clienteSchema.safeParse({
      name: "João Silva",
      cpf: "52998224725",
      phone: "+5511987654321",
    })
    expect(result.success).toBe(true)
  })

  it("defaults active to true", () => {
    const result = clienteSchema.parse({
      name: "João",
      cpf: "52998224725",
      phone: "+5511987654321",
    })
    expect(result.active).toBe(true)
  })
})
