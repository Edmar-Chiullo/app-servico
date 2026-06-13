import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { getFinancialSummary, listFinancialEntries } from "@/lib/services/financeiro"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const period = searchParams.get("period") as "daily" | "weekly" | "monthly" || "daily"
  const page = Number(searchParams.get("page") || "1")

  const [summary, entries] = await Promise.all([
    getFinancialSummary(period),
    listFinancialEntries({ page }),
  ])

  return NextResponse.json({ summary, ...entries })
}
