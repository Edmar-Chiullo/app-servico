"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui"
import { OSForm } from "../components/OSForm"
import { toast } from "react-toastify"

export default function NovaOSPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSave(data: any) {
    setLoading(true)
    try {
      const res = await fetch("/api/ordens-servico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao abrir OS")
      toast.success("Ordem de serviço aberta!")
      router.push("/ordens-servico")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Nova Ordem de Serviço</h1>
      <Card>
        <OSForm onSave={handleSave} loading={loading} />
      </Card>
    </div>
  )
}
