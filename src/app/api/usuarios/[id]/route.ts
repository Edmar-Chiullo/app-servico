import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { getUsuario, updateUsuario } from "@/lib/services/usuario"
import { usuarioUpdateSchema } from "@/lib/validations/usuario"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const permission = requireRole(user, [UserRole.ADMIN])
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.error }, { status: 403 })
  }

  const { id } = await params
  const usuario = await getUsuario(id)
  if (!usuario) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })

  return NextResponse.json(usuario)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const permission = requireRole(user, [UserRole.ADMIN])
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.error }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const parsed = usuarioUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const usuario = await updateUsuario(id, parsed.data, user.id)
    return NextResponse.json(usuario)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
