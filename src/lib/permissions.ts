import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import type { UserRole } from "./enums"

export async function getSession() {
  return getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user as { id: string; name: string; email: string; role: UserRole } | undefined
}

export function hasRole(user: { role: UserRole } | undefined, roles: UserRole[]) {
  if (!user) return false
  return roles.includes(user.role)
}

export function requireRole(user: { role: UserRole } | undefined, roles: UserRole[]) {
  if (!user) return { allowed: false, error: "Não autenticado" }
  if (!roles.includes(user.role)) return { allowed: false, error: "Sem permissão" }
  return { allowed: true, error: null }
}
