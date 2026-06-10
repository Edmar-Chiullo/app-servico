import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { getRelatorioData } from "@/lib/services/relatorio"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

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
