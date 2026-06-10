"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Loading } from "../ui"
import type { UserRole } from "@/lib/enums"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return <Loading text="Carregando..." />
  }

  const user = session?.user as { id: string; name: string; email: string; role: UserRole } | undefined

  if (!user) return null

  return (
    <div className="min-h-screen flex">
      <Sidebar userRole={user.role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header user={user} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
