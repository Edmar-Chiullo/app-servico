import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { getOrdemById, completeOrdem } from "@/lib/services/ordem-servico"
import { concluirOSSchema } from "@/lib/validations/ordem-servico"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  const ordem = await getOrdemById(id)
  if (!ordem) return NextResponse.json({ error: "Ordem não encontrada" }, { status: 404 })

  return NextResponse.json(ordem)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT, UserRole.TECHNICIAN])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  const { id } = await params
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  if (body.action === "complete") {
    const parsed = concluirOSSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    try {
      const result = await completeOrdem(id, parsed.data, user.id)
      return NextResponse.json(result)
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 400 })
    }
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 })
}
