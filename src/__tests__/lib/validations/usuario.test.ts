import { describe, it, expect } from "vitest"
import { usuarioSchema, usuarioUpdateSchema } from "@/lib/validations"

describe("usuarioSchema", () => {
  it("accepts valid user data", () => {
    const result = usuarioSchema.safeParse({
      name: "Admin",
      email: "admin@email.com",
      password: "123456",
      role: "ADMIN",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email", () => {
    const result = usuarioSchema.safeParse({
      name: "Admin",
      email: "invalido",
      password: "123456",
      role: "ADMIN",
    })
    expect(result.success).toBe(false)
  })

  it("rejects short password", () => {
    const result = usuarioSchema.safeParse({
      name: "Admin",
      email: "admin@email.com",
      password: "123",
      role: "ADMIN",
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid role", () => {
    const result = usuarioSchema.safeParse({
      name: "Admin",
      email: "admin@email.com",
      password: "123456",
      role: "INVALID",
    })
    expect(result.success).toBe(false)
  })
})

describe("usuarioUpdateSchema", () => {
  it("accepts partial update", () => {
    const result = usuarioUpdateSchema.safeParse({ name: "Novo Nome" })
    expect(result.success).toBe(true)
  })

  it("accepts empty password (keeps existing)", () => {
    const result = usuarioUpdateSchema.safeParse({ password: "" })
    expect(result.success).toBe(true)
  })

  it("accepts role change", () => {
    const result = usuarioUpdateSchema.safeParse({ role: "MANAGER" })
    expect(result.success).toBe(true)
  })
})
