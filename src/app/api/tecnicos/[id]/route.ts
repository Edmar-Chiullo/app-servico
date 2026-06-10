import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { updateTecnico } from "@/lib/services/tecnico"
import { tecnicoSchema } from "@/lib/validations/tecnico"
import { UserRole } from "@/lib/enums"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const permission = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER])
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.error }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const parsed = tecnicoSchema.partial().safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const tecnico = await updateTecnico(id, parsed.data, user.id)
  return NextResponse.json(tecnico)
}
