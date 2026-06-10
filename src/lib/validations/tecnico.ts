import { z } from "zod"

export const tecnicoSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos"),
  role: z.string().min(1, "Cargo é obrigatório"),
  phone: z.string().optional().or(z.literal("")),
  active: z.boolean().default(true),
})

export type TecnicoFormData = z.infer<typeof tecnicoSchema>
