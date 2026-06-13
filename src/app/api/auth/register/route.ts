import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { UserRole } from "@/lib/enums"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  const perm = requireRole(user, [UserRole.ADMIN])
  if (!perm.allowed) {
    return NextResponse.json({ error: "Apenas administradores podem criar usuários" }, { status: 403 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  const { name, email, password, role } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Campos obrigatórios" }, { status: 400 })
  }

  if (role && !Object.values(UserRole).includes(role)) {
    return NextResponse.json({ error: "Role inválida" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const created = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.ATTENDANT,
    },
  })

  return NextResponse.json({ id: created.id, name: created.name, email: created.email })
}
