import { describe, it, expect } from "vitest"
import { tecnicoSchema } from "@/lib/validations"

describe("tecnicoSchema", () => {
  it("accepts valid technician data", () => {
    const result = tecnicoSchema.safeParse({
      name: "Carlos Mecânico",
      cpf: "52998224725",
      role: "Mecânico Sênior",
      phone: "+5511987654321",
    })
    expect(result.success).toBe(true)
  })

  it("rejects missing name", () => {
    const result = tecnicoSchema.safeParse({
      cpf: "52998224725",
      role: "Mecânico",
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid CPF format", () => {
    const result = tecnicoSchema.safeParse({
      name: "Carlos",
      cpf: "123",
      role: "Mecânico",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing role", () => {
    const result = tecnicoSchema.safeParse({
      name: "Carlos",
      cpf: "52998224725",
    })
    expect(result.success).toBe(false)
  })

  it("accepts technician without phone", () => {
    const result = tecnicoSchema.safeParse({
      name: "Carlos",
      cpf: "52998224725",
      role: "Mecânico",
    })
    expect(result.success).toBe(true)
  })
})
