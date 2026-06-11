import { prisma } from "../prisma"
import { createAuditLog } from "./audit"
import { Prisma } from "@prisma/client"
import { AuditOperation } from "../enums"

type TecnicoInput = {
  name: string
  cpf: string
  role: string
  phone?: string
}

export async function listTecnicos(params: {
  search?: string
  page?: number
  pageSize?: number
  includeInactive?: boolean
}) {
  const { search, page = 1, pageSize = 10, includeInactive = false } = params

  const where: Prisma.TechnicianWhereInput = {}

  if (!includeInactive) where.active = true

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { cpf: { contains: search } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.technician.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.technician.count({ where }),
  ])

  return { data, total, page, totalPages: Math.ceil(total / pageSize) }
}

export async function createTecnico(data: TecnicoInput, userId: string) {
  const tecnico = await prisma.technician.create({
    data: { ...data, createdByUserId: userId },
  })

  await createAuditLog({
    userId,
    entityType: "Technician",
    entityId: tecnico.id,
    operation: AuditOperation.CREATE,
    changes: data,
  })

  return tecnico
}

export async function getTecnico(id: string) {
  return prisma.technician.findUnique({ where: { id } })
}

export async function updateTecnico(id: string, data: Partial<TecnicoInput & { active: boolean }>, userId: string) {
  const oldData = await prisma.technician.findUnique({ where: { id } })
  const tecnico = await prisma.technician.update({ where: { id }, data })

  await createAuditLog({
    userId,
    entityType: "Technician",
    entityId: id,
    operation: AuditOperation.UPDATE,
    changes: { before: oldData, after: data },
  })

  return tecnico
}

export async function getTecnicosSelect() {
  return prisma.technician.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}
