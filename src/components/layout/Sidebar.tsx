"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { UserRole } from "@/lib/enums"
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Package,
  ClipboardList,
  DollarSign,
  BarChart3,
  Settings,
  X,
} from "lucide-react"

type SidebarProps = {
  userRole: UserRole
  isOpen: boolean
  onClose: () => void
}

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  Package,
  ClipboardList,
  DollarSign,
  BarChart3,
  Settings,
}

const menuItems = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard", roles: ["ADMIN", "MANAGER"] },
  { href: "/clientes", label: "Clientes", icon: "Users", roles: ["ADMIN", "MANAGER", "ATTENDANT"] },
  { href: "/veiculos", label: "Veículos", icon: "Car", roles: ["ADMIN", "MANAGER", "ATTENDANT"] },
  { href: "/tecnicos", label: "Técnicos", icon: "Wrench", roles: ["ADMIN", "MANAGER"] },
  { href: "/produtos", label: "Produtos", icon: "Package", roles: ["ADMIN", "MANAGER"] },
  { href: "/ordens-servico", label: "Ordens de Serviço", icon: "ClipboardList", roles: ["ADMIN", "MANAGER", "ATTENDANT", "TECHNICIAN"] },
  { href: "/financeiro", label: "Financeiro", icon: "DollarSign", roles: ["ADMIN", "MANAGER"] },
  { href: "/relatorios", label: "Relatórios", icon: "BarChart3", roles: ["ADMIN", "MANAGER"] },
  { href: "/usuarios", label: "Usuários", icon: "Users", roles: ["ADMIN"] },
  { href: "/configuracoes", label: "Configurações", icon: "Settings", roles: ["ADMIN"] },
]

export function Sidebar({ userRole, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const filteredItems = menuItems.filter((item) => item.roles.includes(userRole))

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">App Serviço</h1>
        <button onClick={onClose} className="text-gray-400 hover:text-white md:hidden transition-colors">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {Icon && <Icon size={18} />}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-900 text-white min-h-screen shrink-0">
        {sidebarContent}
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col shadow-xl animate-slide-in">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
