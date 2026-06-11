import { prisma } from "../prisma"
import { Prisma } from "@prisma/client"

export async function getDashboardData() {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    servicesToday,
    servicesOpen,
    servicesInProgress,
    servicesWaitingParts,
    servicesCompleted,
    servicesCancelled,
    dailyRevenue,
    weeklyRevenue,
    monthlyRevenue,
    totalCustomers,
    lowStockProducts,
    technicianProductivity,
  ] = await Promise.all([
    prisma.serviceOrder.count({
      where: { openingDate: { gte: startOfDay } },
    }),
    prisma.serviceOrder.count({
      where: { status: "OPEN" },
    }),
    prisma.serviceOrder.count({
      where: { status: "IN_PROGRESS" },
    }),
    prisma.serviceOrder.count({
      where: { status: "WAITING_PARTS" },
    }),
    prisma.serviceOrder.count({
      where: { status: "COMPLETED" },
    }),
    prisma.serviceOrder.count({
      where: { status: "CANCELLED" },
    }),
    prisma.financialEntry.aggregate({
      _sum: { value: true },
      where: { date: { gte: startOfDay } },
    }),
    prisma.financialEntry.aggregate({
      _sum: { value: true },
      where: { date: { gte: startOfWeek } },
    }),
    prisma.financialEntry.aggregate({
      _sum: { value: true },
      where: { date: { gte: startOfMonth } },
    }),
    prisma.customer.count({
      where: { active: true },
    }),
    prisma.$queryRaw`
      SELECT COUNT(*)::int as count FROM products 
      WHERE active = true AND "stockQuantity" <= "stockMin"
    `.then((r: any) => Number(r[0]?.count ?? 0)),
    prisma.technician.findMany({
      where: { active: true },
      include: {
        serviceOrders: {
          where: {
            status: "COMPLETED",
            completionDate: { gte: startOfMonth },
          },
          select: { totalValue: true, laborValue: true, openingDate: true, completionDate: true },
        },
      },
    }),
  ])

  const productivity = technicianProductivity.map((tech) => {
    const completedCount = tech.serviceOrders.length
    const totalValue = tech.serviceOrders.reduce((sum, os) => sum + Number(os.totalValue), 0)
    const totalTimeHours = tech.serviceOrders.reduce((sum, os) => {
      if (os.completionDate) {
        const diff = os.completionDate.getTime() - os.openingDate.getTime()
        return sum + diff / (1000 * 60 * 60)
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
    servicesToday,
    servicesOpen,
    servicesInProgress,
    servicesWaitingParts,
    servicesCompleted,
    servicesCancelled,
    dailyRevenue: Number(dailyRevenue._sum.value ?? 0),
    weeklyRevenue: Number(weeklyRevenue._sum.value ?? 0),
    monthlyRevenue: Number(monthlyRevenue._sum.value ?? 0),
    totalCustomers,
    lowStockProducts,
    technicianProductivity: productivity,
  }
}
