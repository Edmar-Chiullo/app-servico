import { prisma } from "../prisma"
import { createAuditLog } from "./audit"
import { Prisma } from "@prisma/client"
import { AuditOperation } from "../enums"
import bcrypt from "bcryptjs"
import { usuarioSchema, usuarioUpdateSchema } from "../validations"

type UsuarioInput = {
  name: string
  email: string
  password: string
  role: string
}

export async function listUsuarios(params: {
  search?: string
  page?: number
  pageSize?: number
  includeInactive?: boolean
}) {
  const { search, page = 1, pageSize = 5, includeInactive = false } = params

  const where: Prisma.UserWhereInput = {}

  if (!includeInactive) where.active = true

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ])

  return { data, total, page, totalPages: Math.ceil(total / pageSize) }
}

export async function createUsuario(data: UsuarioInput, userId: string) {
  usuarioSchema.parse(data)
  data.name = data.name.toUpperCase()
  const hashedPassword = await bcrypt.hash(data.password, 12)

  const usuario = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    },
  })

  await createAuditLog({
    userId,
    entityType: "User",
    entityId: usuario.id,
    operation: AuditOperation.CREATE,
    changes: { name: data.name, email: data.email, role: data.role },
  })

  return usuario
}

export async function getUsuario(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  })
}

export async function updateUsuario(
  id: string,
  data: Partial<UsuarioInput & { active: boolean }>,
  userId: string
) {
  usuarioUpdateSchema.parse(data)
  if (data.name) data.name = data.name.toUpperCase()

  const updateData: any = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.email !== undefined) updateData.email = data.email
  if (data.role !== undefined) updateData.role = data.role
  if (data.active !== undefined) updateData.active = data.active
  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 12)
  }

  const oldData = await prisma.user.findUnique({ where: { id } })
  const usuario = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
    },
  })

  await createAuditLog({
    userId,
    entityType: "User",
    entityId: id,
    operation: AuditOperation.UPDATE,
    changes: { before: oldData, after: data },
  })

  return usuario
}
