import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { registerStockMovement } from "@/lib/services/produto"
import { movimentacaoSchema } from "@/lib/validations/produto"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const body = await req.json()
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
