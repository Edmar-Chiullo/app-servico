import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { getVeiculoById, updateVeiculo, deleteVeiculo } from "@/lib/services/veiculo"
import { veiculoSchema } from "@/lib/validations/veiculo"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  const veiculo = await getVeiculoById(id)
  if (!veiculo) return NextResponse.json({ error: "Veículo não encontrado" }, { status: 404 })

  return NextResponse.json(veiculo)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  const body = await req.json()
  const parsed = veiculoSchema.partial().safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const veiculo = await updateVeiculo(id, parsed.data, user.id)
  return NextResponse.json(veiculo)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  await deleteVeiculo(id, user.id)
  return NextResponse.json({ success: true })
}
