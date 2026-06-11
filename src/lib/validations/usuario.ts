import { z } from "zod"
import { UserRole } from "../enums"

export const usuarioSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.nativeEnum(UserRole),
})

export const usuarioUpdateSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional().or(z.literal("")),
  role: z.nativeEnum(UserRole).optional(),
  active: z.boolean().optional(),
})

export type UsuarioFormData = z.infer<typeof usuarioSchema>
export type UsuarioUpdateData = z.infer<typeof usuarioUpdateSchema>
