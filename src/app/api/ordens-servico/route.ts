import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { listOrdens, createOrdem } from "@/lib/services/ordem-servico"
import { ordemServicoSchema } from "@/lib/validations/ordem-servico"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || undefined
  const status = searchParams.get("status") || undefined
  const customerId = searchParams.get("customerId") || undefined
  const vehicleId = searchParams.get("vehicleId") || undefined
  const technicianId = searchParams.get("technicianId") || undefined
  const page = Number(searchParams.get("page") || "1")

  const result = await listOrdens({
    search,
    status: status as any,
    customerId,
    vehicleId,
    technicianId,
    page,
  })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.ATTENDANT, UserRole.TECHNICIAN])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
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
