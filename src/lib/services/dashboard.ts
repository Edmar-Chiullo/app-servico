import { prisma } from "../prisma"
import { getBrazilDayRange, getBrazilWeekRange, getBrazilMonthRange } from "@/lib/utils/date"

export async function getDashboardData() {
  const { startOfDay, endOfDay } = getBrazilDayRange()
  const { startOfWeek } = getBrazilWeekRange()
  const { startOfMonth } = getBrazilMonthRange()

  const [statusCounts, financial, totalCustomers, lowStockProducts, technicianProductivity] =
    await Promise.all([
      prisma.serviceOrder.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      prisma.$queryRaw<{ period: string; total: number }[]>`
        SELECT period, COALESCE(SUM(value), 0) as total
        FROM (
          SELECT 'daily' as period, value FROM financial_entries WHERE date >= ${startOfDay} AND date < ${endOfDay}
          UNION ALL
          SELECT 'weekly' as period, value FROM financial_entries WHERE date >= ${startOfWeek}
          UNION ALL
          SELECT 'monthly' as period, value FROM financial_entries WHERE date >= ${startOfMonth}
        ) sub
        GROUP BY period
      `,

      prisma.customer.count({ where: { active: true } }),

      prisma.$queryRaw<{ count: number }[]>`
        SELECT COUNT(*)::int as count FROM products 
        WHERE active = true AND "stockQuantity" <= "stockMin"
      `.then((r) => Number(r[0]?.count ?? 0)),

      prisma.technician.findMany({
        where: { active: true },
        include: {
          serviceOrders: {
            where: { status: "COMPLETED", completionDate: { gte: startOfMonth } },
            select: { totalValue: true, openingDate: true, completionDate: true },
          },
        },
      }),
    ])

  const today = await prisma.serviceOrder.count({
    where: { openingDate: { gte: startOfDay } },
  })

  const financialByPeriod: Record<string, number> = {}
  for (const row of financial) {
    financialByPeriod[row.period] = Number(row.total)
  }

  function getStatusCount(status: string): number {
    return statusCounts.find((s) => s.status === status)?._count.status ?? 0
  }

  const productivity = technicianProductivity.map((tech) => {
    const orders = tech.serviceOrders
    const completedCount = orders.length
    const totalValue = orders.reduce((sum, os) => sum + Number(os.totalValue), 0)
    const totalTimeHours = orders.reduce((sum, os) => {
      if (os.completionDate) {
        return sum + (os.completionDate.getTime() - os.openingDate.getTime()) / (1000 * 60 * 60)
      }
      return sum
    }, 0)

    return {
      id: tech.id,
      name: tech.name,
      completedCount,
      totalValue,
      avgTimeHours: completedCount > 0 ? totalTimeHours / completedCount : 0,
    }
  })

  return {
    servicesToday: today,
    servicesOpen: getStatusCount("OPEN"),
    servicesInProgress: getStatusCount("IN_PROGRESS"),
    servicesWaitingParts: getStatusCount("WAITING_PARTS"),
    servicesCompleted: getStatusCount("COMPLETED"),
    servicesCancelled: getStatusCount("CANCELLED"),
    dailyRevenue: financialByPeriod.daily ?? 0,
    weeklyRevenue: financialByPeriod.weekly ?? 0,
    monthlyRevenue: financialByPeriod.monthly ?? 0,
    totalCustomers,
    lowStockProducts,
    technicianProductivity: productivity,
  }
}
