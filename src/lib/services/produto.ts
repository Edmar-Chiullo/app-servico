import { prisma } from "../prisma"
import { createAuditLog } from "./audit"
import { Prisma } from "@prisma/client"
import { AuditOperation, StockMovementType } from "../enums"

type ProdutoInput = {
  code: string
  description: string
  category?: string
  unit?: string
  stockQuantity?: number
  stockMin?: number
  stockMax?: number
  costPrice?: number
  salePrice?: number
}

export async function listProdutos(params: {
  search?: string
  page?: number
  pageSize?: number
  lowStock?: boolean
  includeInactive?: boolean
}) {
  const { search, page = 1, pageSize = 10, lowStock, includeInactive = false } = params

  const where: Prisma.ProductWhereInput = {}

  if (!includeInactive) where.active = true
  if (lowStock) where.stockQuantity = { lte: prisma.product.fields.stockMin }
  if (search) {
    where.OR = [
      { code: { contains: search } },
      { description: { contains: search } },
    ]
  }

  const [data, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { description: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return { data, total, page, totalPages: Math.ceil(total / pageSize) }
}

export async function createProduto(data: ProdutoInput, userId: string) {
  const produto = await prisma.product.create({ data })

  await createAuditLog({
    userId,
    entityType: "Product",
    entityId: produto.id,
    operation: AuditOperation.CREATE,
    changes: data,
  })

  return produto
}

export async function getProduto(id: string) {
  return prisma.product.findUnique({ where: { id } })
}

export async function updateProduto(id: string, data: Partial<ProdutoInput & { active: boolean }>, userId: string) {
  const oldData = await prisma.product.findUnique({ where: { id } })
  const produto = await prisma.product.update({ where: { id }, data })

  await createAuditLog({
    userId,
    entityType: "Product",
    entityId: id,
    operation: AuditOperation.UPDATE,
    changes: { before: oldData, after: data },
  })

  return produto
}

export async function getProdutosSelect() {
  return prisma.product.findMany({
    where: { active: true },
    select: { id: true, code: true, description: true, salePrice: true, stockQuantity: true },
    orderBy: { description: "asc" },
  })
}

export async function registerStockMovement(
  productId: string,
  type: StockMovementType,
  quantity: number,
  reason: string,
  userId: string,
  orderId?: string
) {
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) throw new Error("Produto não encontrado")

  let newQuantity = product.stockQuantity

  if (type === StockMovementType.IN) {
    newQuantity += quantity
  } else if (type === StockMovementType.OUT || type === StockMovementType.SERVICE_ORDER) {
    if (product.stockQuantity < quantity) {
      throw new Error("Estoque insuficiente")
    }
    newQuantity -= quantity
  } else {
    newQuantity += quantity
  }

  if (newQuantity < 0) throw new Error("Estoque não pode ser negativo")

  const [movement] = await prisma.$transaction([
    prisma.stockMovement.create({
      data: { productId, type, quantity, reason, userId, orderId },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: newQuantity },
    }),
  ])

  await createAuditLog({
    userId,
    entityType: "StockMovement",
    entityId: movement.id,
    operation: AuditOperation.STOCK_MOVE,
    changes: { productId, type, quantity, previousStock: product.stockQuantity, newStock: newQuantity, reason },
  })

  return movement
}
