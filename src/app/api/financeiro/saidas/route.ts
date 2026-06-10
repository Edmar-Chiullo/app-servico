import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { createFinancialExit } from "@/lib/services/financeiro"
import { z } from "zod"

const saidaSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  value: z.coerce.number().min(0.01, "Valor deve ser positivo"),
  date: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const body = await req.json()
  const parsed = saidaSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const exit = await createFinancialExit({
    description: parsed.data.description,
    value: parsed.data.value,
    date: parsed.data.date ? new Date(parsed.data.date) : new Date(),
    userId: user.id,
  })

  return NextResponse.json(exit, { status: 201 })
}
