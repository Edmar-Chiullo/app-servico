import { prisma } from "../prisma"
import { createAuditLog } from "./audit"
import { AuditOperation } from "../enums"
import { getBrazilDayRange, getBrazilWeekRange, getBrazilMonthRange } from "@/lib/utils/date"

export async function getFinancialSummary(period: "daily" | "weekly" | "monthly") {
  let startDate: Date
  let endDate: Date | undefined

  switch (period) {
    case "daily": {
      const range = getBrazilDayRange()
      startDate = range.startOfDay
      endDate = range.endOfDay
      break
    }
    case "weekly":
      startDate = getBrazilWeekRange().startOfWeek
      break
    case "monthly":
      startDate = getBrazilMonthRange().startOfMonth
      break
  }

  const dateFilter: any = { gte: startDate }
  if (endDate) dateFilter.lt = endDate

  const [entries, exits] = await Promise.all([
    prisma.financialEntry.aggregate({
      _sum: { value: true },
      where: { date: dateFilter },
    }),
    prisma.financialExit.aggregate({
      _sum: { value: true },
      where: { date: dateFilter },
    }),
  ])

  return {
    revenue: Number(entries._sum.value ?? 0),
    expenses: Number(exits._sum.value ?? 0),
    balance: Number(entries._sum.value ?? 0) - Number(exits._sum.value ?? 0),
  }
}

export async function createFinancialExit(data: {
  description: string
  value: number
  date: Date
  userId: string
}) {
  const exit = await prisma.financialExit.create({
    data: {
      description: data.description,
      value: data.value,
      date: data.date,
      userId: data.userId,
    },
  })

  await createAuditLog({
    userId: data.userId,
    entityType: "FinancialExit",
    entityId: exit.id,
    operation: AuditOperation.FINANCIAL_MOVE,
    changes: data,
  })

  return exit
}

export async function listFinancialEntries(params: {
  page?: number
  pageSize?: number
  dateFrom?: string
  dateTo?: string
}) {
  const { page = 1, pageSize = 10, dateFrom, dateTo } = params

  const where: any = {}
  if (dateFrom || dateTo) {
    where.date = {}
    if (dateFrom) where.date.gte = new Date(dateFrom)
    if (dateTo) where.date.lte = new Date(dateTo)
  }

  const [entries, exits, totalEntries, totalExits] = await Promise.all([
    prisma.financialEntry.findMany({
      where,
      include: { serviceOrder: { select: { number: true, customer: { select: { name: true } } } } },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.financialExit.findMany({
      where,
      include: { user: { select: { name: true } } },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.financialEntry.count({ where }),
    prisma.financialExit.count({ where }),
  ])

  return { entries, exits, totalEntries, totalExits, page, totalPages: Math.ceil(Math.max(totalEntries, totalExits) / pageSize) }
}
