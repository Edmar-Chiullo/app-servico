import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@/lib/enums"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const productId = searchParams.get("productId")
  const page = Number(searchParams.get("page") || "1")
  const pageSize = 20

  const where: any = {}
  if (productId) where.productId = productId

  const [data, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      include: { product: { select: { description: true, code: true } }, user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.stockMovement.count({ where }),
  ])

  return NextResponse.json({ data, total, page, totalPages: Math.ceil(total / pageSize) })
}
