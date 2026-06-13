import { NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { getDashboardData } from "@/lib/services/dashboard"
import { UserRole } from "@/lib/enums"

export const revalidate = 0

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  const data = await getDashboardData()
  return NextResponse.json(data)
}
