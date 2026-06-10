import { prisma } from "../prisma"
import { createAuditLog } from "./audit"
import { Prisma } from "@prisma/client"
import { AuditOperation } from "../enums"

type ClienteCreateInput = {
  name: string
  cpf: string
  phone: string
  whatsapp?: string
  email?: string
  street?: string
  number?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
}

type ClienteUpdateInput = Partial<ClienteCreateInput> & { active?: boolean }

export async function listClientes(params: {
  search?: string
  page?: number
  pageSize?: number
  includeInactive?: boolean
}) {
  const { search, page = 1, pageSize = 10, includeInactive = false } = params

  const where: Prisma.CustomerWhereInput = {}

  if (!includeInactive) {
    where.active = true
  }

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { cpf: { contains: search } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      include: { vehicles: { select: { id: true, plate: true, model: true, color: true } } },
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.customer.count({ where }),
  ])

  return { data, total, page, totalPages: Math.ceil(total / pageSize) }
}

export async function getClienteById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: { vehicles: true },
  })
}

export async function createCliente(data: ClienteCreateInput, userId: string) {
  const cliente = await prisma.customer.create({ data })

  await createAuditLog({
    userId,
    entityType: "Customer",
    entityId: cliente.id,
    operation: AuditOperation.CREATE,
    changes: data,
  })

  return cliente
}

export async function updateCliente(id: string, data: ClienteUpdateInput, userId: string) {
  const oldData = await prisma.customer.findUnique({ where: { id } })
  const cliente = await prisma.customer.update({ where: { id }, data })

  await createAuditLog({
    userId,
    entityType: "Customer",
    entityId: id,
    operation: AuditOperation.UPDATE,
    changes: { before: oldData, after: data },
  })

  return cliente
}

export async function deleteCliente(id: string, userId: string) {
  const oldData = await prisma.customer.findUnique({ where: { id } })
  const cliente = await prisma.customer.update({
    where: { id },
    data: { active: false },
  })

  await createAuditLog({
    userId,
    entityType: "Customer",
    entityId: id,
    operation: AuditOperation.DELETE,
    changes: { before: oldData, after: { active: false } },
  })

  return cliente
}

export async function getClientesSelect() {
  return prisma.customer.findMany({
    where: { active: true },
    select: { id: true, name: true, cpf: true },
    orderBy: { name: "asc" },
  })
}
