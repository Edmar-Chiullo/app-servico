import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { getTecnico, updateTecnico } from "@/lib/services/tecnico"
import { tecnicoSchema } from "@/lib/validations/tecnico"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  const tecnico = await getTecnico(id)
  if (!tecnico) return NextResponse.json({ error: "Técnico não encontrado" }, { status: 404 })

  return NextResponse.json(tecnico)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const permission = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER])
  if (!permission.allowed) {
    return NextResponse.json({ error: permission.error }, { status: 403 })
  }

  const { id } = await params
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  const parsed = tecnicoSchema.partial().safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const tecnico = await updateTecnico(id, parsed.data, user.id)
    return NextResponse.json(tecnico)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "CPF já cadastrado" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
