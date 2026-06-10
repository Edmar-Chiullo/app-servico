"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui"
import { TecnicoForm } from "../components/TecnicoForm"
import { toast } from "react-toastify"

export default function NovoTecnicoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSave(data: any) {
    setLoading(true)
    try {
      const res = await fetch("/api/tecnicos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.formErrors?.[0] || "Erro ao cadastrar")
      }
      toast.success("Técnico cadastrado!")
      router.push("/tecnicos")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Novo Técnico</h1>
      <Card>
        <TecnicoForm onSave={handleSave} loading={loading} />
      </Card>
    </div>
  )
}
