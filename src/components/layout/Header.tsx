"use client"

import { signOut } from "next-auth/react"
import { Menu } from "lucide-react"
import { SafeUser } from "@/types"

type HeaderProps = {
  user: SafeUser
  onToggleSidebar: () => void
}

export function Header({ user, onToggleSidebar }: HeaderProps) {
  const roleLabels: Record<string, string> = {
    ADMIN: "Administrador",
    MANAGER: "Gerente",
    ATTENDANT: "Atendente",
    TECHNICIAN: "Técnico",
  }

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-600 hover:text-gray-900 transition-colors shrink-0"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            Bem-vindo, {user.name || "Usuário"}
          </h2>
          <p className="text-sm text-gray-500 truncate">{roleLabels[user.role] || user.role}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
