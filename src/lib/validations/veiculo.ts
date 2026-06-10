import { z } from "zod"

const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/

export const veiculoSchema = z.object({
  plate: z.string().regex(plateRegex, "Placa inválida (padrão Mercosul ou antigo)"),
  brand: z.string().optional().or(z.literal("")),
  model: z.string().min(1, "Modelo é obrigatório"),
  year: z.preprocess((v) => v === "" || v === undefined ? undefined : Number(v), z.number().int().min(1900).max(2100).optional()),
  color: z.string().min(1, "Cor é obrigatória"),
  mileage: z.preprocess((v) => v === "" || v === undefined ? undefined : Number(v), z.number().int().min(0).optional()),
  customerId: z.string().min(1, "Cliente é obrigatório"),
  active: z.boolean().default(true),
})

export type VeiculoFormData = z.infer<typeof veiculoSchema>
