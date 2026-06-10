export const UserRole = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  ATTENDANT: "ATTENDANT",
  TECHNICIAN: "TECHNICIAN",
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const ServiceOrderStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  WAITING_PARTS: "WAITING_PARTS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const

export type ServiceOrderStatus = (typeof ServiceOrderStatus)[keyof typeof ServiceOrderStatus]

export const StockMovementType = {
  IN: "IN",
  OUT: "OUT",
  ADJUSTMENT: "ADJUSTMENT",
  SERVICE_ORDER: "SERVICE_ORDER",
} as const

export type StockMovementType = (typeof StockMovementType)[keyof typeof StockMovementType]

export const AuditOperation = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  STATUS_CHANGE: "STATUS_CHANGE",
  STOCK_MOVE: "STOCK_MOVE",
  FINANCIAL_MOVE: "FINANCIAL_MOVE",
} as const

export type AuditOperation = (typeof AuditOperation)[keyof typeof AuditOperation]
