import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/layout/AuthProvider"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from "react-toastify"

export const metadata: Metadata = {
  title: "App Serviço - Gestão de Oficina",
  description: "Sistema de gerenciamento de clientes, veículos e ordens de serviço",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full bg-gray-50">
        <AuthProvider>
          {children}
          <ToastContainer position="top-right" autoClose={3000} />
        </AuthProvider>
      </body>
    </html>
  )
}
