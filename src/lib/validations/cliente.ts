import { z } from "zod"

export const clienteSchema = z.object({
  name: z.string().min(1, "Nome completo é obrigatório"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos").optional().or(z.literal("")),
  phone: z.string().regex(/^\+55\d{10,11}$/, "Telefone deve estar no formato internacional (+55)").optional().or(z.literal("")),
  whatsapp: z.string().regex(/^\+55\d{10,11}$/, "WhatsApp deve estar no formato internacional (+55)").optional().or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  street: z.string().optional().or(z.literal("")),
  number: z.string().optional().or(z.literal("")),
  neighborhood: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().length(2, "Estado deve ter 2 caracteres").optional().or(z.literal("")),
  zipCode: z.string().regex(/^\d{8}$/, "CEP deve conter 8 dígitos").optional().or(z.literal("")),
  active: z.boolean().default(true),
})

export type ClienteFormData = z.infer<typeof clienteSchema>
