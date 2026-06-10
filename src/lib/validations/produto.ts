import { z } from "zod"

export const produtoSchema = z.object({
  code: z.string().min(1, "Código é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  category: z.string().optional().or(z.literal("")),
  unit: z.string().default("UN"),
  stockQuantity: z.coerce.number().int().min(0, "Estoque não pode ser negativo").default(0),
  stockMin: z.coerce.number().int().min(0).default(0),
  stockMax: z.coerce.number().int().min(0).default(0),
  costPrice: z.coerce.number().min(0).default(0),
  salePrice: z.coerce.number().min(0).default(0),
  active: z.boolean().default(true),
})

export type ProdutoFormData = z.infer<typeof produtoSchema>

export const movimentacaoSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  type: z.enum(["IN", "OUT", "ADJUSTMENT"]),
  quantity: z.coerce.number().int().min(1, "Quantidade deve ser positiva"),
  reason: z.string().min(1, "Motivo é obrigatório"),
})

export type MovimentacaoFormData = z.infer<typeof movimentacaoSchema>
