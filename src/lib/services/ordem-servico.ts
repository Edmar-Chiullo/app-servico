import { prisma } from "../prisma"
import { AuditOperation, ServiceOrderStatus, StockMovementType } from "../enums"
import { Prisma } from "@prisma/client"
import { ALLOWED_STATUS_TRANSITIONS } from "../utils/constants"
import { ordemServicoSchema, concluirOSSchema, statusUpdateSchema } from "../validations"
import { generateSearchKey } from "../utils/searchKey"

type CreateOSInput = {
  customerName: string
  vehiclePlate: string
  vehicleModel: string
  vehicleColor: string
  technicianId: string
  problemDescription: string
  priority?: string
  notes?: string
  customerWhatsapp?: string
  vehicleBrand?: string
  responsibleUserId: string
}

type CompleteOSInput = {
  diagnostic: string
  executedService: string
  laborValue: number
  products: { productId: string; quantity: number; unitPrice: number }[]
}

export async function listOrdens(params: {
  search?: string
  status?: ServiceOrderStatus
  customerId?: string
  vehicleId?: string
  technicianId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}) {
  const { search, status, customerId, vehicleId, technicianId, dateFrom, dateTo, page = 1, pageSize = 5 } = params

  const where: Prisma.ServiceOrderWhereInput = {}

  if (status) where.status = status
  if (customerId) where.customerId = customerId
  if (vehicleId) where.vehicleId = vehicleId
  if (technicianId) where.technicianId = technicianId
  if (dateFrom) where.openingDate = { ...(where.openingDate as any || {}), gte: new Date(dateFrom) }
  if (dateTo) where.openingDate = { ...(where.openingDate as any || {}), lte: new Date(dateTo) }

  if (search) {
    where.OR = [
      { customer: { name: { contains: search, mode: "insensitive" } } },
      { customer: { cpf: { contains: search, mode: "insensitive" } } },
      { vehicle: { plate: { contains: search, mode: "insensitive" } } },
      { vehicle: { model: { contains: search, mode: "insensitive" } } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.serviceOrder.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, cpf: true } },
        vehicle: { select: { id: true, plate: true, model: true, brand: true } },
        technician: { select: { id: true, name: true } },
        serviceOrderProducts: {
          include: { product: { select: { id: true, description: true, code: true } } },
        },
      },
      orderBy: { number: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.serviceOrder.count({ where }),
  ])

  return { data, total, page, totalPages: Math.ceil(total / pageSize) }
}

export async function getOrdemById(id: string) {
  return prisma.serviceOrder.findUnique({
    where: { id },
    include: {
      customer: true,
      vehicle: true,
      technician: true,
      serviceOrderProducts: { include: { product: true } },
      statusHistories: { include: { changedBy: { select: { name: true } } }, orderBy: { changedAt: "asc" } },
    },
  })
}

export async function createOrdem(input: CreateOSInput) {
  const { responsibleUserId, customerName, vehiclePlate, vehicleModel, vehicleColor, customerWhatsapp, vehicleBrand, ...rest } = input

  const plate = vehiclePlate.toUpperCase().replace(/[^A-Z0-9]/g, "")

  const ordem = await prisma.$transaction(async (tx) => {
    let existingVehicle = await tx.vehicle.findUnique({
      where: { plate },
    })

    let vehicleId: string
    let customerId: string

    if (existingVehicle) {
      vehicleId = existingVehicle.id
      customerId = existingVehicle.customerId
    } else {
      const searchKey = generateSearchKey(customerName, plate)
      let customer = await tx.customer.findUnique({
        where: { searchKey },
      })
      if (!customer) {
        customer = await tx.customer.findFirst({
          where: { name: customerName.toUpperCase() },
        })
      }
      if (!customer) {
        customer = await tx.customer.create({
          data: { name: customerName.toUpperCase(), searchKey, cpf: null, phone: null, whatsapp: customerWhatsapp || null },
        })
      }
      customerId = customer.id

      const newVehicle = await tx.vehicle.create({
        data: {
          plate,
          brand: vehicleBrand || null,
          model: vehicleModel.toUpperCase(),
          color: vehicleColor.toUpperCase(),
          customerId,
        },
      })
      vehicleId = newVehicle.id
    }

    const lastOrder = await tx.serviceOrder.findFirst({
      orderBy: { number: "desc" },
      select: { number: true },
    })
    const nextNumber = (lastOrder?.number ?? 0) + 1

    const created = await tx.serviceOrder.create({
      data: {
        ...rest,
        customerId,
        vehicleId,
        number: nextNumber,
        responsibleUserId,
      },
    })

    await tx.statusHistory.create({
      data: {
        serviceOrderId: created.id,
        toStatus: ServiceOrderStatus.OPEN,
        changedByUserId: responsibleUserId,
      },
    })

    await tx.auditLog.create({
      data: {
        userId: responsibleUserId,
        entityType: "ServiceOrder",
        entityId: created.id,
        operation: AuditOperation.CREATE,
        changes: JSON.stringify(input),
      },
    })

    return created
  })

  return ordem
}

export async function updateStatus(
  id: string,
  newStatus: ServiceOrderStatus,
  userId: string
) {
  statusUpdateSchema.parse({ status: newStatus })
  const ordem = await prisma.serviceOrder.findUnique({ where: { id } })
  if (!ordem) throw new Error("Ordem de serviço não encontrada")

  const allowed = ALLOWED_STATUS_TRANSITIONS[ordem.status]
  if (!allowed?.includes(newStatus)) {
    throw new Error(`Transição de ${ordem.status} para ${newStatus} não permitida`)
  }

  const updateData: any = { status: newStatus }
  if (newStatus === ServiceOrderStatus.COMPLETED) {
    updateData.completionDate = new Date()
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updated = await tx.serviceOrder.update({
      where: { id },
      data: updateData,
    })

    await tx.statusHistory.create({
      data: {
        serviceOrderId: id,
        fromStatus: ordem.status,
        toStatus: newStatus,
        changedByUserId: userId,
      },
    })

    await tx.auditLog.create({
      data: {
        userId,
        entityType: "ServiceOrder",
        entityId: id,
        operation: AuditOperation.STATUS_CHANGE,
        changes: JSON.stringify({ from: ordem.status, to: newStatus }),
      },
    })

    if (newStatus === ServiceOrderStatus.CANCELLED) {
      await tx.financialEntry.deleteMany({
        where: { serviceOrderId: id },
      })
    }

    return updated
  })

  return updated
}

export async function completeOrdem(
  id: string,
  input: CompleteOSInput,
  userId: string
) {
  concluirOSSchema.parse(input)
  const ordem = await prisma.serviceOrder.findUnique({ where: { id } })
  if (!ordem) throw new Error("Ordem de serviço não encontrada")
  if (ordem.status !== ServiceOrderStatus.IN_PROGRESS && ordem.status !== ServiceOrderStatus.WAITING_PARTS) {
    throw new Error("Ordem deve estar em Andamento ou Aguardando Peças para ser concluída")
  }

  const result = await prisma.$transaction(async (tx) => {
    let materialsValue = 0

    for (const item of input.products) {
      const product = await tx.product.findUnique({ where: { id: item.productId } })
      if (!product || !product.active) throw new Error(`Produto ${item.productId} inválido ou inativo`)
      if (product.stockQuantity < item.quantity) throw new Error(`Estoque insuficiente para ${product.description}`)

      const totalPrice = item.quantity * item.unitPrice
      materialsValue += totalPrice
    }

    const totalValue = input.laborValue + materialsValue

    const updated = await tx.serviceOrder.update({
      where: { id },
      data: {
        status: ServiceOrderStatus.COMPLETED,
        completionDate: new Date(),
        diagnostic: input.diagnostic,
        executedService: input.executedService,
        laborValue: input.laborValue,
        materialsValue,
        totalValue,
      },
    })

    for (const item of input.products) {
      await tx.serviceOrderProduct.create({
        data: {
          serviceOrderId: id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice,
        },
      })

      await tx.stockMovement.create({
        data: {
          productId: item.productId,
          type: StockMovementType.SERVICE_ORDER,
          quantity: item.quantity,
          reason: `Utilização na OS #${ordem.number}`,
          userId,
          orderId: id,
        },
      })

      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      })
    }

    await tx.financialEntry.create({
      data: {
        serviceOrderId: id,
        value: totalValue,
        date: new Date(),
      },
    })

    await tx.statusHistory.create({
      data: {
        serviceOrderId: id,
        fromStatus: ordem.status,
        toStatus: ServiceOrderStatus.COMPLETED,
        changedByUserId: userId,
      },
    })

    await tx.auditLog.create({
      data: {
        userId,
        entityType: "ServiceOrder",
        entityId: id,
        operation: AuditOperation.UPDATE,
        changes: JSON.stringify({ action: "completed", diagnostic: input.diagnostic, totalValue }),
      },
    })

    return updated
  })

  return result
}
