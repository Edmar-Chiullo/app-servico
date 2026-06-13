import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { registerStockMovement } from "@/lib/services/produto"
import { movimentacaoSchema } from "@/lib/validations/produto"
import { UserRole } from "@/lib/enums"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  const parsed = movimentacaoSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const movement = await registerStockMovement(
      parsed.data.productId,
      parsed.data.type as any,
      parsed.data.quantity,
      parsed.data.reason,
      user.id
    )
    return NextResponse.json(movement, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
