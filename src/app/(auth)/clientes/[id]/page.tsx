"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, Button, Table, Badge, Loading, FormattedText } from "@/components/ui"
import { ClienteForm } from "../components/ClienteForm"
import { STATUS_OS, STATUS_OS_COLORS } from "@/lib/utils/constants"
import { formatDate, formatCurrency } from "@/lib/utils/format"
import { toast } from "react-toastify"

export default function EditarClientePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [cliente, setCliente] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showVehicles, setShowVehicles] = useState(false)
  const [ordens, setOrdens] = useState<any[]>([])

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

  useEffect(() => {
    async function loadOrdens() {
      try {
        const res = await fetch(`/api/ordens-servico?customerId=${id}&pageSize=100`)
        if (!res.ok) return
        const json = await res.json()
        setOrdens(json.data || [])
      } catch { }
    }
    loadOrdens()
  }, [id])

  async function handleSave(data: any) {
    setSaving(true)
    try {
      const res = await fetch(`/api/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro ao salvar")
      }
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

      <Card title="Histórico de Ordens de Serviço">
        <Table
          columns={[
            { key: "number", header: "Nº", render: (o: any) => `#${o.number}` },
            { key: "vehicle", header: "Veículo", render: (o: any) => <><FormattedText>{o.vehicle.model}</FormattedText> - {o.vehicle.plate}</> },
            { key: "openingDate", header: "Data", render: (o: any) => formatDate(o.openingDate) },
            {
              key: "status",
              header: "Status",
              render: (o: any) => (
                <Badge className={STATUS_OS_COLORS[o.status]}>
                  {STATUS_OS[o.status as keyof typeof STATUS_OS] || o.status}
                </Badge>
              ),
            },
            { key: "totalValue", header: "Valor", render: (o: any) => formatCurrency(o.totalValue) },
          ]}
          data={ordens}
          onRowClick={(o: any) => router.push(`/ordens-servico/${o.id}`)}
          emptyMessage="Nenhuma ordem de serviço encontrada para este cliente"
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
            { key: "model", header: "Modelo", render: (v: any) => <FormattedText>{v.model}</FormattedText> },
            { key: "brand", header: "Marca", render: (v: any) => v.brand ? <FormattedText>{v.brand}</FormattedText> : "-" },
            { key: "color", header: "Cor", render: (v: any) => <FormattedText>{v.color}</FormattedText> },
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
