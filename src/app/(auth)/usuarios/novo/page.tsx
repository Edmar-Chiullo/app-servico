"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui"
import { UsuarioForm } from "../components/UsuarioForm"
import { toast } from "react-toastify"

export default function NovoUsuarioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSave(data: any) {
    setLoading(true)
    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.fieldErrors ? Object.values(err.error.fieldErrors).flat()[0] : err.error || "Erro ao cadastrar")
      }
      toast.success("Usuário cadastrado!")
      router.push("/usuarios")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Novo Usuário</h1>
      <Card>
        <UsuarioForm onSave={handleSave} loading={loading} />
      </Card>
    </div>
  )
}
