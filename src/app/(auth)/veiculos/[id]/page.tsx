"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, Table, Badge, Loading, FormattedText } from "@/components/ui"
import { VeiculoForm } from "../components/VeiculoForm"
import { STATUS_OS, STATUS_OS_COLORS } from "@/lib/utils/constants"
import { formatDate, formatCurrency } from "@/lib/utils/format"
import { toast } from "react-toastify"

type OS = {
  id: string
  number: number
  status: string
  openingDate: string
  totalValue: number
  problemDescription: string
  customer: { name: string }
  vehicle: { plate: string; model: string; brand: string | null }
}

export default function EditarVeiculoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const queryClient = useQueryClient()

  const { data: veiculo, isLoading } = useQuery({
    queryKey: ["veiculo", id],
    queryFn: async () => {
      const res = await fetch(`/api/veiculos/${id}`)
      if (!res.ok) throw new Error("Veículo não encontrado")
      return res.json()
    },
  })

  const { data: ordens } = useQuery({
    queryKey: ["ordens-veiculo", id],
    queryFn: async () => {
      const res = await fetch(`/api/ordens-servico?vehicleId=${id}&pageSize=100`)
      if (!res.ok) return []
      const json = await res.json()
      return json.data || []
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/veiculos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Veículo atualizado!")
      queryClient.invalidateQueries({ queryKey: ["veiculo", id] })
      queryClient.invalidateQueries({ queryKey: ["veiculos"] })
      router.push("/veiculos")
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
  })

  if (isLoading) return <Loading />
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
          onSave={async (data) => saveMutation.mutateAsync(data)}
          loading={saveMutation.isPending}
        />
      </Card>

      <Card title="Histórico de Ordens de Serviço">
        <Table
          columns={[
            { key: "number", header: "Nº", render: (o: OS) => `#${o.number}` },
            { key: "openingDate", header: "Data", render: (o: OS) => formatDate(o.openingDate) },
            { key: "customer", header: "Cliente", render: (o: OS) => <FormattedText>{o.customer?.name}</FormattedText> },
            { key: "problemDescription", header: "Problema", render: (o: OS) => o.problemDescription || "-" },
            {
              key: "status",
              header: "Status",
              render: (o: OS) => (
                <Badge className={STATUS_OS_COLORS[o.status]}>
                  {STATUS_OS[o.status as keyof typeof STATUS_OS] || o.status}
                </Badge>
              ),
            },
            { key: "totalValue", header: "Valor", render: (o: OS) => formatCurrency(o.totalValue) },
          ]}
          data={ordens ?? []}
          onRowClick={(o: OS) => router.push(`/ordens-servico/${o.id}`)}
          emptyMessage="Nenhuma ordem de serviço encontrada para este veículo"
        />
      </Card>
    </div>
  )
}
