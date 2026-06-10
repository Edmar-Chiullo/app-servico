"use client"

import { useState } from "react"
import { Card, Button, Input, Select } from "@/components/ui"
import { toast } from "react-toastify"
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function RelatoriosGerenciaisPage() {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
  })
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  async function loadReport() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
      if (filters.dateTo) params.set("dateTo", filters.dateTo)
      if (filters.status) params.set("status", filters.status)

      const res = await fetch(`/api/relatorios?${params}`)
      if (!res.ok) throw new Error("Erro ao carregar relatório")
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  function downloadXLSX() {
    const params = new URLSearchParams()
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
    if (filters.dateTo) params.set("dateTo", filters.dateTo)
    if (filters.status) params.set("status", filters.status)
    window.open(`/api/relatorios/xlsx?${params}`, "_blank")
  }

  const statusChartData = data ? {
    labels: ["Abertos", "Em Andamento", "Aguardando", "Concluídos", "Cancelados"],
    datasets: [{
      label: "Serviços",
      data: [data.byStatus.OPEN, data.byStatus.IN_PROGRESS, data.byStatus.WAITING_PARTS, data.byStatus.COMPLETED, data.byStatus.CANCELLED],
      backgroundColor: ["#3B82F6", "#F59E0B", "#F97316", "#10B981", "#EF4444"],
    }],
  } : null

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Relatórios Gerenciais</h1>

      <Card title="Filtros">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input label="Data Início" type="date" value={filters.dateFrom} onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })} />
          <Input label="Data Fim" type="date" value={filters.dateTo} onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })} />
          <Select label="Status" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} options={[
            { value: "OPEN", label: "Aberto" },
            { value: "IN_PROGRESS", label: "Em Andamento" },
            { value: "COMPLETED", label: "Concluído" },
            { value: "CANCELLED", label: "Cancelado" },
          ]} placeholder="Todos" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={loadReport} loading={loading} fullWidth>Gerar Relatório</Button>
          <Button variant="secondary" onClick={downloadXLSX} disabled={!data} fullWidth>Exportar XLSX</Button>
        </div>
      </Card>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{data.totalCount}</p></Card>
            <Card><p className="text-sm text-gray-500">Concluídos</p><p className="text-2xl font-bold text-green-600">{data.completedCount}</p></Card>
            <Card><p className="text-sm text-gray-500">Receita Total</p><p className="text-2xl font-bold">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data.totalRevenue)}</p></Card>
            <Card><p className="text-sm text-gray-500">Tempo Médio</p><p className="text-2xl font-bold">{data.avgCompletionTime.toFixed(1)}h</p></Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Serviços por Status">
              {statusChartData && (
                <div className="h-64">
                  <Bar data={statusChartData} options={{ maintainAspectRatio: false }} />
                </div>
              )}
            </Card>

            <Card title="Últimas Ordens">
              <div className="overflow-y-auto max-h-64 space-y-2">
                {data.ordens.slice(0, 10).map((o: any) => (
                  <div key={o.id} className="flex justify-between text-sm border-b pb-1">
                    <span>#{o.number} - {o.customer.name}</span>
                    <span className="text-gray-500">{o.technician.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
