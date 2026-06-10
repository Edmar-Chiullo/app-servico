"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui"
import { ClienteForm } from "../components/ClienteForm"
import { toast } from "react-toastify"

export default function NovoClientePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSave(data: any) {
    setLoading(true)
    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.formErrors?.[0] || "Erro ao cadastrar")
      }
      toast.success("Cliente cadastrado com sucesso!")
      router.push("/clientes")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Novo Cliente</h1>
      <Card>
        <ClienteForm onSave={handleSave} loading={loading} />
      </Card>
    </div>
  )
}
