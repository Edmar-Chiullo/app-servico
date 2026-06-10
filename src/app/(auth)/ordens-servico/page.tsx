"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, Table, Pagination, Input, Button, Badge } from "@/components/ui"
import { STATUS_OS, STATUS_OS_COLORS } from "@/lib/utils/constants"
import { formatDate, formatCurrency } from "@/lib/utils/format"
import { toast } from "react-toastify"

type OS = {
  id: string
  number: number
  status: string
  priority: string
  openingDate: string
  totalValue: number
  customer: { name: string; cpf: string }
  vehicle: { plate: string; model: string; brand: string | null }
  technician: { name: string }
}

export default function OrdensServicoPage() {
  const router = useRouter()
  const [data, setData] = useState<OS[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      const res = await fetch(`/api/ordens-servico?${params}`)
      if (!res.ok) throw new Error("Erro ao carregar")
      const json = await res.json()
      setData(json.data)
      setTotalPages(json.totalPages)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => { loadData() }, [loadData])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={() => router.push("/ordens-servico/relatorios")} fullWidth>
            Relatórios
          </Button>
          <Button onClick={() => router.push("/ordens-servico/nova")} fullWidth>
            Nova OS
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input
            placeholder="Buscar por cliente, CPF ou placa..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full sm:flex-1"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="w-full sm:w-auto rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Todos status</option>
            {Object.entries(STATUS_OS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <Table
          columns={[
            { key: "number", header: "Nº", render: (o: OS) => `#${o.number}` },
            { key: "customer", header: "Cliente", render: (o: OS) => o.customer.name },
            { key: "vehicle", header: "Veículo", render: (o: OS) => `${o.vehicle.model} - ${o.vehicle.plate}` },
            { key: "technician", header: "Técnico", render: (o: OS) => o.technician.name },
            {
              key: "status",
              header: "Status",
              render: (o: OS) => (
                <Badge className={STATUS_OS_COLORS[o.status]}>
                  {STATUS_OS[o.status as keyof typeof STATUS_OS] || o.status}
                </Badge>
              ),
            },
            { key: "openingDate", header: "Abertura", render: (o: OS) => formatDate(o.openingDate) },
            { key: "totalValue", header: "Valor", render: (o: OS) => formatCurrency(o.totalValue) },
          ]}
          data={data}
          onRowClick={(o) => router.push(`/ordens-servico/${o.id}`)}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  )
}
