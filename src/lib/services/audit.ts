import { prisma } from "../prisma"
import type { AuditOperation } from "../enums"

type AuditParams = {
  userId: string
  entityType: string
  entityId?: string
  operation: AuditOperation
  changes?: Record<string, any>
}

export async function createAuditLog(params: AuditParams) {
  return prisma.auditLog.create({
    data: {
      userId: params.userId,
      entityType: params.entityType,
      entityId: params.entityId,
      operation: params.operation,
      changes: params.changes ? JSON.stringify(params.changes) : null,
    },
  })
}
