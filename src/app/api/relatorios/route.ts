import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { getRelatorioData } from "@/lib/services/relatorio"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const filters = {
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    customerId: searchParams.get("customerId") || undefined,
    technicianId: searchParams.get("technicianId") || undefined,
    status: searchParams.get("status") || undefined,
    vehicleId: searchParams.get("vehicleId") || undefined,
  }

  const data = await getRelatorioData(filters)
  return NextResponse.json(data)
}
