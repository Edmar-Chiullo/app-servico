"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, Loading } from "@/components/ui"
import { VeiculoForm } from "../components/VeiculoForm"
import { toast } from "react-toastify"

export default function EditarVeiculoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [veiculo, setVeiculo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/veiculos/${id}`)
        if (!res.ok) throw new Error("Veículo não encontrado")
        const json = await res.json()
        setVeiculo(json)
      } catch (err: any) {
        toast.error(err.message)
        router.push("/veiculos")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  async function handleSave(data: any) {
    setSaving(true)
    try {
      const res = await fetch(`/api/veiculos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Veículo atualizado!")
      router.push("/veiculos")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (!veiculo) return null

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Editar Veículo</h1>
      <Card>
        <VeiculoForm
          initialData={{
            id: veiculo.id,
            plate: veiculo.plate,
            brand: veiculo.brand || "",
            model: veiculo.model,
            year: String(veiculo.year || ""),
            color: veiculo.color,
            mileage: String(veiculo.mileage || ""),
            customerId: veiculo.customerId,
          }}
          onSave={handleSave}
          loading={saving}
        />
      </Card>
    </div>
  )
}
