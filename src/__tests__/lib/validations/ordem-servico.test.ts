import { describe, it, expect } from "vitest"
import { ordemServicoSchema, concluirOSSchema, statusUpdateSchema } from "@/lib/validations"

describe("ordemServicoSchema", () => {
  it("accepts valid OS data", () => {
    const result = ordemServicoSchema.safeParse({
      customerName: "João Silva",
      vehiclePlate: "ABC1234",
      vehicleModel: "Gol",
      vehicleColor: "Prata",
      technicianId: "tech-id",
      problemDescription: "Barulho no motor",
      priority: "normal",
      notes: "Cliente trouxe ontem",
    })
    expect(result.success).toBe(true)
  })

  it("defaults priority to normal", () => {
    const result = ordemServicoSchema.parse({
      customerName: "João",
      vehiclePlate: "ABC1234",
      vehicleModel: "Gol",
      vehicleColor: "Prata",
      technicianId: "t1",
      problemDescription: "Problema",
    })
    expect(result.priority).toBe("normal")
  })

  it("rejects missing customerName", () => {
    const result = ordemServicoSchema.safeParse({
      vehiclePlate: "ABC1234",
      vehicleModel: "Gol",
      vehicleColor: "Prata",
      technicianId: "t1",
      problemDescription: "Problema",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing vehiclePlate", () => {
    const result = ordemServicoSchema.safeParse({
      customerName: "João",
      vehicleModel: "Gol",
      vehicleColor: "Prata",
      technicianId: "t1",
      problemDescription: "Problema",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing technicianId", () => {
    const result = ordemServicoSchema.safeParse({
      customerName: "João",
      vehiclePlate: "ABC1234",
      vehicleModel: "Gol",
      vehicleColor: "Prata",
      problemDescription: "Problema",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing problemDescription", () => {
    const result = ordemServicoSchema.safeParse({
      customerName: "João",
      vehiclePlate: "ABC1234",
      vehicleModel: "Gol",
      vehicleColor: "Prata",
      technicianId: "t1",
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid priority", () => {
    const result = ordemServicoSchema.safeParse({
      customerName: "João",
      vehiclePlate: "ABC1234",
      vehicleModel: "Gol",
      vehicleColor: "Prata",
      technicianId: "t1",
      problemDescription: "Problema",
      priority: "inexistente",
    })
    expect(result.success).toBe(false)
  })
})

describe("concluirOSSchema", () => {
  it("accepts valid completion data", () => {
    const result = concluirOSSchema.safeParse({
      diagnostic: "Motor com desgaste",
      executedService: "Troca de óleo e filtros",
      laborValue: 150.00,
      products: [
        { productId: "p1", quantity: 2, unitPrice: 25.00 },
      ],
    })
    expect(result.success).toBe(true)
  })

  it("accepts completion without products", () => {
    const result = concluirOSSchema.safeParse({
      diagnostic: "Diagnóstico",
      executedService: "Serviço",
      laborValue: 100,
      products: [],
    })
    expect(result.success).toBe(true)
  })

  it("rejects missing diagnostic", () => {
    const result = concluirOSSchema.safeParse({
      executedService: "Serviço",
      laborValue: 100,
      products: [],
    })
    expect(result.success).toBe(false)
  })

  it("rejects negative labor value", () => {
    const result = concluirOSSchema.safeParse({
      diagnostic: "Diag",
      executedService: "Serv",
      laborValue: -10,
      products: [],
    })
    expect(result.success).toBe(false)
  })

  it("rejects product with zero quantity", () => {
    const result = concluirOSSchema.safeParse({
      diagnostic: "Diag",
      executedService: "Serv",
      laborValue: 100,
      products: [{ productId: "p1", quantity: 0, unitPrice: 10 }],
    })
    expect(result.success).toBe(false)
  })
})

describe("statusUpdateSchema", () => {
  it("accepts valid status transitions", () => {
    expect(statusUpdateSchema.safeParse({ status: "IN_PROGRESS" }).success).toBe(true)
    expect(statusUpdateSchema.safeParse({ status: "WAITING_PARTS" }).success).toBe(true)
    expect(statusUpdateSchema.safeParse({ status: "COMPLETED" }).success).toBe(true)
    expect(statusUpdateSchema.safeParse({ status: "CANCELLED" }).success).toBe(true)
  })

  it("rejects OPEN status (initial only)", () => {
    const result = statusUpdateSchema.safeParse({ status: "OPEN" })
    expect(result.success).toBe(false)
  })

  it("rejects invalid status string", () => {
    const result = statusUpdateSchema.safeParse({ status: "INVALID" })
    expect(result.success).toBe(false)
  })
})
