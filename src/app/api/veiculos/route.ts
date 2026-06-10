import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { listVeiculos, createVeiculo } from "@/lib/services/veiculo"
import { veiculoSchema } from "@/lib/validations/veiculo"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || undefined
  const customerId = searchParams.get("customerId") || undefined
  const page = Number(searchParams.get("page") || "1")

  const result = await listVeiculos({ search, customerId, page })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const body = await req.json()
  const parsed = veiculoSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const veiculo = await createVeiculo(parsed.data, user.id)
  return NextResponse.json(veiculo, { status: 201 })
}
