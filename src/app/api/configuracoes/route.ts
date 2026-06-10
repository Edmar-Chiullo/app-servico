import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@/lib/enums"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const settings = await prisma.companySettings.findUnique({ where: { id: "default" } })
  return NextResponse.json(settings)
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const permission = requireRole(user, [UserRole.ADMIN])
  if (!permission.allowed) {
    return NextResponse.json({ error: "Apenas administradores" }, { status: 403 })
  }

  const body = await req.json()
  const settings = await prisma.companySettings.upsert({
    where: { id: "default" },
    update: body,
    create: { id: "default", ...body },
  })

  return NextResponse.json(settings)
}
