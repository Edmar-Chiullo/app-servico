import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { getClienteById, updateCliente, deleteCliente } from "@/lib/services/cliente"
import { clienteSchema } from "@/lib/validations/cliente"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  const cliente = await getClienteById(id)
  if (!cliente) return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 })

  return NextResponse.json(cliente)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  const { id } = await params
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  const parsed = clienteSchema.partial().safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const cliente = await updateCliente(id, parsed.data, user.id)
    return NextResponse.json(cliente)
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "CPF já cadastrado" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  const { id } = await params
  await deleteCliente(id, user.id)
  return NextResponse.json({ success: true })
}
