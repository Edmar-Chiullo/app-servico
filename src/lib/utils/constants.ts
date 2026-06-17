import type { UserRole } from "../enums"

export const STATUS_OS = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em Andamento",
  WAITING_PARTS: "Aguardando Peças",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
} as const

export const STATUS_OS_COLORS: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800",
  WAITING_PARTS: "bg-orange-100 text-orange-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

export const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  ATTENDANT: "Atendente",
  TECHNICIAN: "Técnico",
}

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ["*"],
  MANAGER: [
    "clientes", "veiculos", "produtos", "tecnicos",
    "ordens-servico", "relatorios", "dashboard", "financeiro",
  ],
  ATTENDANT: [
    "clientes", "veiculos", "ordens-servico:create",
    "ordens-servico:view", "consultar",
  ],
  TECHNICIAN: [
    "ordens-servico:assigned", "ordens-servico:update-status",
  ],
}

export const ALLOWED_STATUS_TRANSITIONS: Record<string, string[]> = {
  OPEN: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["WAITING_PARTS", "COMPLETED"],
  WAITING_PARTS: ["IN_PROGRESS", "COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
}

export const VEHICLE_BRANDS = [
  "Fiat", "Volkswagen", "Chevrolet", "Ford", "Honda", "Toyota",
  "Nissan", "Renault", "Hyundai", "Jeep", "Peugeot", "Citroën",
  "Mitsubishi", "BMW", "Mercedes-Benz", "Audi", "Kia", "Volvo",
  "Land Rover", "Suzuki", "Chrysler", "Dodge", "Jac", "Chery",
  "Caoa Chery", "Subaru", "Porsche", "Ram", "Iveco", "Mini",
  "JAC Motors", "Effa", "Shineray", "Troller", "Lifan", "Hafei",
]

export const ITEMS_PER_PAGE = 10
