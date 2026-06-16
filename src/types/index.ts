import type { UserRole, ServiceOrderStatus } from "@/lib/enums.ts"

export type SafeUser = {
  id: string
  name: string | null
  email: string | null
  role: UserRole
}

export type DashboardData = {
  servicesToday: number
  servicesOpen: number
  servicesInProgress: number
  servicesWaitingParts: number
  servicesCompleted: number
  servicesCancelled: number
  dailyRevenue: number
  weeklyRevenue: number
  monthlyRevenue: number
  totalCustomers: number
  lowStockProducts: number
  technicianProductivity: {
    id: string
    name: string
    completedCount: number
    totalValue: number
    avgTimeHours: number
  }[]
}

export type ClienteWithVehicles = {
  id: string
  name: string
  cpf: string | null
  phone: string | null
  email: string | null
  active: boolean
  street: string | null
  number: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  vehicles: { id: string; plate: string; model: string; color: string }[]
  createdAt: Date
}

export type ServiceOrderWithRelations = {
  id: string
  number: number
  status: ServiceOrderStatus
  problemDescription: string
  priority: string
  openingDate: Date
  completionDate: Date | null
  laborValue: number
  materialsValue: number
  totalValue: number
  customer: { id: string; name: string; cpf: string | null }
  vehicle: { id: string; plate: string; model: string; brand: string | null }
  technician: { id: string; name: string }
  products: {
    product: { id: string; description: string; code: string }
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
}

export type PaginatedResult<T> = {
  data: T[]
  total: number
  page: number
  totalPages: number
}

export type OSDetailData = {
  id: string
  number: number
  status: ServiceOrderStatus
  priority: string
  problemDescription: string
  diagnostic: string | null
  executedService: string | null
  laborValue: number
  materialsValue: number
  totalValue: number
  notes: string | null
  openingDate: string
  completionDate: string | null
  customer: { id: string; name: string; cpf: string | null } & Record<string, any>
  vehicle: { id: string; plate: string; model: string; brand: string | null; color?: string; year?: number | null }
  technician: { id: string; name: string }
  serviceOrderProducts: {
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    product: { id: string; description: string; code: string }
  }[]
  statusHistories: {
    id: string
    fromStatus: string | null
    toStatus: string
    changedAt: string
    changedBy: { name: string } | null
  }[]
}

export type FinanceiroSummary = {
  revenue: number
  expenses: number
  balance: number
}

export type FinanceiroEntry = {
  id: string
  value: number
  date: string
  serviceOrder: {
    number: number
    customer: { name: string }
  } | null
}

export type FinanceiroExit = {
  id: string
  description: string
  value: number
  date: string
}

export type FinanceiroData = {
  summary: FinanceiroSummary
  entries: FinanceiroEntry[]
  exits: FinanceiroExit[]
}

export type RelatorioData = {
  totalCount: number
  completedCount: number
  totalRevenue: number
  avgCompletionTime: number
  byStatus: Record<string, number>
  ordens: {
    id: string
    number: number
    customer: { name: string }
    technician: { name: string }
    status: string
    totalValue: number
  }[]
}
