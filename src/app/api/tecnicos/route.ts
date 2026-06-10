import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { listTecnicos, createTecnico } from "@/lib/services/tecnico"
import { tecnicoSchema } from "@/lib/validations/tecnico"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || undefined
  const page = Number(searchParams.get("page") || "1")

  const result = await listTecnicos({ search, page })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const permission = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER])
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.error }, { status: 403 })
  }

  const body = await req.json()
  const parsed = tecnicoSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const tecnico = await createTecnico(parsed.data, user.id)
  return NextResponse.json(tecnico, { status: 201 })
}
