import { z } from "zod"

export const ordemServicoSchema = z.object({
  customerId: z.string().min(1, "Cliente é obrigatório"),
  vehicleId: z.string().min(1, "Veículo é obrigatório"),
  technicianId: z.string().min(1, "Técnico é obrigatório"),
  problemDescription: z.string().min(1, "Descrição do problema é obrigatória"),
  priority: z.enum(["baixa", "normal", "alta", "urgente"]).default("normal"),
  notes: z.string().optional().or(z.literal("")),
})

export type OrdemServicoFormData = z.infer<typeof ordemServicoSchema>

export const concluirOSSchema = z.object({
  diagnostic: z.string().min(1, "Diagnóstico técnico é obrigatório"),
  executedService: z.string().min(1, "Serviço executado é obrigatório"),
  laborValue: z.coerce.number().min(0, "Valor da mão de obra deve ser positivo"),
  products: z.array(z.object({
    productId: z.string(),
    quantity: z.coerce.number().int().min(1),
    unitPrice: z.coerce.number().min(0),
  })),
})

export type ConcluirOSFormData = z.infer<typeof concluirOSSchema>

export const statusUpdateSchema = z.object({
  status: z.enum(["IN_PROGRESS", "WAITING_PARTS", "COMPLETED", "CANCELLED"]),
})

export type StatusUpdateData = z.infer<typeof statusUpdateSchema>
