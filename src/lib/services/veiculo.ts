import { prisma } from "../prisma"
import { createAuditLog } from "./audit"
import { Prisma } from "@prisma/client"
import { AuditOperation } from "../enums"

type VeiculoInput = {
  plate: string
  brand?: string
  model: string
  year?: number
  color: string
  mileage?: number
  customerId: string
}

export async function listVeiculos(params: {
  search?: string
  customerId?: string
  page?: number
  pageSize?: number
}) {
  const { search, customerId, page = 1, pageSize = 10 } = params

  const where: Prisma.VehicleWhereInput = { active: true }

  if (customerId) where.customerId = customerId

  if (search) {
    where.OR = [
      { plate: { contains: search } },
      { model: { contains: search } },
      { color: { contains: search } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { plate: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.vehicle.count({ where }),
  ])

  return { data, total, page, totalPages: Math.ceil(total / pageSize) }
}

export async function getVeiculoById(id: string) {
  return prisma.vehicle.findUnique({
    where: { id },
    include: { customer: { select: { id: true, name: true } } },
  })
}

export async function createVeiculo(data: VeiculoInput, userId: string) {
  const veiculo = await prisma.vehicle.create({ data })

  await createAuditLog({
    userId,
    entityType: "Vehicle",
    entityId: veiculo.id,
    operation: AuditOperation.CREATE,
    changes: data,
  })

  return veiculo
}

export async function updateVeiculo(id: string, data: Partial<VeiculoInput>, userId: string) {
  const oldData = await prisma.vehicle.findUnique({ where: { id } })
  const veiculo = await prisma.vehicle.update({ where: { id }, data })

  if (data.customerId && data.customerId !== oldData?.customerId) {
    await prisma.ownershipHistory.create({
      data: {
        vehicleId: id,
        previousCustomerId: oldData?.customerId,
        newCustomerId: data.customerId,
        changedByUserId: userId,
      },
    })
  }

  await createAuditLog({
    userId,
    entityType: "Vehicle",
    entityId: id,
    operation: AuditOperation.UPDATE,
    changes: { before: oldData, after: data },
  })

  return veiculo
}

export async function deleteVeiculo(id: string, userId: string) {
  const oldData = await prisma.vehicle.findUnique({ where: { id } })
  const veiculo = await prisma.vehicle.update({
    where: { id },
    data: { active: false },
  })

  await createAuditLog({
    userId,
    entityType: "Vehicle",
    entityId: id,
    operation: AuditOperation.DELETE,
    changes: { before: oldData, after: { active: false } },
  })

  return veiculo
}

export async function getVeiculosByCustomer(customerId: string) {
  return prisma.vehicle.findMany({
    where: { customerId, active: true },
    select: { id: true, plate: true, model: true, brand: true, color: true, year: true },
    orderBy: { plate: "asc" },
  })
}

export async function getVeiculosSelect() {
  return prisma.vehicle.findMany({
    where: { active: true },
    select: { id: true, plate: true, model: true, customerId: true },
    orderBy: { plate: "asc" },
  })
}
