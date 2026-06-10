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
  cpf: string
  phone: string
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
  customer: { id: string; name: string; cpf: string }
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
