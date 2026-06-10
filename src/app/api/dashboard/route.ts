import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { getDashboardData } from "@/lib/services/dashboard"

export const revalidate = 0

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const data = await getDashboardData()
  return NextResponse.json(data)
}
