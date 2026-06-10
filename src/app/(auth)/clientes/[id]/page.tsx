"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, Button, Table, Loading } from "@/components/ui"
import { ClienteForm } from "../components/ClienteForm"
import { toast } from "react-toastify"

export default function EditarClientePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [cliente, setCliente] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showVehicles, setShowVehicles] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/clientes/${id}`)
        if (!res.ok) throw new Error("Cliente não encontrado")
        const json = await res.json()
        setCliente(json)
      } catch (err: any) {
        toast.error(err.message)
        router.push("/clientes")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  async function handleSave(data: any) {
    setSaving(true)
    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Cliente atualizado!")
      router.push("/clientes")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Desativar este cliente?")) return
    try {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao desativar")
      toast.success("Cliente desativado")
      router.push("/clientes")
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  if (loading) return <Loading />
  if (!cliente) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Editar Cliente</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="danger" onClick={handleDelete} fullWidth>
            Desativar
          </Button>
        </div>
      </div>

      <Card>
        <ClienteForm
          initialData={{
            id: cliente.id,
            name: cliente.name,
            cpf: cliente.cpf,
            phone: cliente.phone,
            whatsapp: cliente.whatsapp || "",
            email: cliente.email || "",
            street: cliente.street || "",
            number: cliente.number || "",
            neighborhood: cliente.neighborhood || "",
            city: cliente.city || "",
            state: cliente.state || "",
            zipCode: cliente.zipCode || "",
            active: cliente.active,
          }}
          onSave={handleSave}
          loading={saving}
        />
      </Card>

      <Card title="Veículos" action={
        <Button size="sm" onClick={() => router.push(`/veiculos/novo?customerId=${id}`)}>
          Novo Veículo
        </Button>
      }>
        <Table
          columns={[
            { key: "plate", header: "Placa" },
            { key: "model", header: "Modelo" },
            { key: "brand", header: "Marca" },
            { key: "color", header: "Cor" },
            { key: "year", header: "Ano" },
          ]}
          data={cliente.vehicles || []}
          onRowClick={(v: any) => router.push(`/veiculos/${v.id}`)}
          emptyMessage="Nenhum veículo cadastrado"
        />
      </Card>
    </div>
  )
}
