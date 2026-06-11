import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { listUsuarios, createUsuario } from "@/lib/services/usuario"
import { usuarioSchema } from "@/lib/validations/usuario"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const permission = requireRole(user, [UserRole.ADMIN])
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.error }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || undefined
  const page = Number(searchParams.get("page") || "1")
  const includeInactive = searchParams.get("includeInactive") === "true"

  const result = await listUsuarios({ search, page, includeInactive })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const permission = requireRole(user, [UserRole.ADMIN])
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.error }, { status: 403 })
  }

  const body = await req.json()
  const parsed = usuarioSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const usuario = await createUsuario(parsed.data, user.id)
    return NextResponse.json(usuario, { status: 201 })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
