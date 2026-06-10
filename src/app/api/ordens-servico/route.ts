import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { listOrdens, createOrdem } from "@/lib/services/ordem-servico"
import { ordemServicoSchema } from "@/lib/validations/ordem-servico"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || undefined
  const status = searchParams.get("status") || undefined
  const customerId = searchParams.get("customerId") || undefined
  const technicianId = searchParams.get("technicianId") || undefined
  const page = Number(searchParams.get("page") || "1")

  const result = await listOrdens({
    search,
    status: status as any,
    customerId,
    technicianId,
    page,
  })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const body = await req.json()
  const parsed = ordemServicoSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const ordem = await createOrdem({
    ...parsed.data,
    responsibleUserId: user.id,
  })

  return NextResponse.json(ordem, { status: 201 })
}
