import { prisma } from "../prisma"
import { Prisma } from "@prisma/client"
import type { ServiceOrderStatus } from "../enums"

type RelatorioFiltros = {
  dateFrom?: string
  dateTo?: string
  customerId?: string
  technicianId?: string
  status?: string
  vehicleId?: string
}

export async function getRelatorioData(filters: RelatorioFiltros) {
  const where: Prisma.ServiceOrderWhereInput = {}

  if (filters.dateFrom) {
    where.openingDate = { ...(where.openingDate as any || {}), gte: new Date(filters.dateFrom) }
  }
  if (filters.dateTo) {
    where.openingDate = { ...(where.openingDate as any || {}), lte: new Date(filters.dateTo) }
  }
  if (filters.customerId) where.customerId = filters.customerId
  if (filters.technicianId) where.technicianId = filters.technicianId
  if (filters.vehicleId) where.vehicleId = filters.vehicleId
  if (filters.status) where.status = filters.status as ServiceOrderStatus

  const ordens = await prisma.serviceOrder.findMany({
    where,
    include: {
      customer: { select: { name: true, cpf: true } },
      vehicle: { select: { plate: true, model: true, brand: true } },
      technician: { select: { name: true } },
      serviceOrderProducts: {
        include: { product: { select: { description: true, code: true } } },
      },
    },
    orderBy: { openingDate: "desc" },
  })

  const totalRevenue = ordens
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + Number(o.totalValue), 0)

  const byStatus = {
    OPEN: ordens.filter((o) => o.status === "OPEN").length,
    IN_PROGRESS: ordens.filter((o) => o.status === "IN_PROGRESS").length,
    WAITING_PARTS: ordens.filter((o) => o.status === "WAITING_PARTS").length,
    COMPLETED: ordens.filter((o) => o.status === "COMPLETED").length,
    CANCELLED: ordens.filter((o) => o.status === "CANCELLED").length,
  }

  const avgCompletionTime = ordens
    .filter((o) => o.status === "COMPLETED" && o.completionDate)
    .reduce((sum, o) => {
      const diff = o.completionDate!.getTime() - o.openingDate.getTime()
      return sum + diff / (1000 * 60 * 60)
    }, 0)
  const completedCount = ordens.filter((o) => o.status === "COMPLETED").length

  const company = await prisma.companySettings.findUnique({ where: { id: "default" } })

  return {
    ordens,
    totalRevenue,
    byStatus,
    avgCompletionTime: completedCount > 0 ? avgCompletionTime / completedCount : 0,
    completedCount,
    totalCount: ordens.length,
    company,
  }
}
