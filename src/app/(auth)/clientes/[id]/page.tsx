"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, Button, Table, Badge, Loading, FormattedText } from "@/components/ui"
import { ClienteForm } from "../components/ClienteForm"
import { STATUS_OS, STATUS_OS_COLORS } from "@/lib/utils/constants"
import { formatDate, formatCurrency } from "@/lib/utils/format"
import { toast } from "react-toastify"

export default function EditarClientePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const queryClient = useQueryClient()

  const { data: cliente, isLoading } = useQuery({
    queryKey: ["cliente", id],
    queryFn: async () => {
      const res = await fetch(`/api/clientes/${id}`)
      if (!res.ok) throw new Error("Cliente não encontrado")
      return res.json()
    },
  })

  const { data: ordens } = useQuery({
    queryKey: ["ordens-cliente", id],
    queryFn: async () => {
      const res = await fetch(`/api/ordens-servico?customerId=${id}&pageSize=100`)
      if (!res.ok) return []
      const json = await res.json()
      return json.data || []
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro ao salvar")
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success("Cliente atualizado!")
      queryClient.invalidateQueries({ queryKey: ["cliente", id] })
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      router.push("/clientes")
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao desativar")
    },
    onSuccess: () => {
      toast.success("Cliente desativado")
      queryClient.invalidateQueries({ queryKey: ["clientes"] })
      router.push("/clientes")
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
  })

  if (isLoading) return <Loading />
  if (!cliente) return null

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Editar Cliente</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="danger"
            onClick={() => { if (confirm("Desativar este cliente?")) deleteMutation.mutate() }}
            loading={deleteMutation.isPending}
            fullWidth
          >
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
          onSave={async (data) => saveMutation.mutateAsync(data)}
          loading={saveMutation.isPending}
        />
      </Card>

      <Card title="Histórico de Ordens de Serviço">
        <Table
          columns={[
            { key: "number", header: "Nº", render: (o: any) => `#${o.number}` },
            { key: "vehicle", header: "Veículo", render: (o: any) => <><FormattedText>{o.vehicle?.model}</FormattedText> - {o.vehicle?.plate}</> },
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
          data={ordens ?? []}
          onRowClick={(o: any) => router.push(`/ordens-servico/${o.id}`)}
          emptyMessage="Nenhuma ordem de serviço encontrada para este cliente"
        />
      </Card>

      <Card title="Veículos">
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
