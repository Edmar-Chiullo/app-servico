import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { listClientes, createCliente } from "@/lib/services/cliente"
import { clienteSchema } from "@/lib/validations/cliente"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || undefined
  const page = Number(searchParams.get("page") || "1")
  const includeInactive = searchParams.get("includeInactive") === "true"

  const result = await listClientes({ search, page, includeInactive })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  const parsed = clienteSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const cliente = await createCliente(parsed.data, user.id)
    return NextResponse.json(cliente, { status: 201 })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "CPF já cadastrado" }, { status: 409 })
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
