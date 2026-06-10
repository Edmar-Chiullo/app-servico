"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui"
import { VeiculoForm } from "../components/VeiculoForm"
import { toast } from "react-toastify"

export default function NovoVeiculoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultCustomerId = searchParams.get("customerId") || ""
  const [loading, setLoading] = useState(false)

  async function handleSave(data: any) {
    setLoading(true)
    try {
      const res = await fetch("/api/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, year: data.year ? Number(data.year) : null, mileage: data.mileage ? Number(data.mileage) : null }),
      })
      if (!res.ok) throw new Error("Erro ao cadastrar")
      toast.success("Veículo cadastrado!")
      router.push("/veiculos")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Novo Veículo</h1>
      <Card>
        <VeiculoForm
          onSave={handleSave}
          loading={loading}
          initialData={defaultCustomerId ? { customerId: defaultCustomerId } as any : undefined}
        />
      </Card>
    </div>
  )
}
