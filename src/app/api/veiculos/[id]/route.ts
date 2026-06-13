import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { getVeiculoById, updateVeiculo, deleteVeiculo } from "@/lib/services/veiculo"
import { veiculoSchema } from "@/lib/validations/veiculo"
import { UserRole } from "@/lib/enums"

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

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  const { id } = await params
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
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

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  const { id } = await params
  await deleteVeiculo(id, user.id)
  return NextResponse.json({ success: true })
}
