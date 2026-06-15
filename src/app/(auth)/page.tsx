"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, Loading } from "@/components/ui"
import type { DashboardData } from "@/types"
import { formatCurrency } from "@/lib/utils/format"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { Bar, Doughnut } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

async function fetchDashboard(): Promise<DashboardData> {
  const res = await fetch("/api/dashboard")
  if (!res.ok) throw new Error("Erro ao carregar dashboard")
  return res.json()
}

export default function DashboardPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    refetchInterval: 5 * 60 * 1000,
  })

  if (isLoading) return <Loading text="Carregando dashboard..." />
  if (!data) return <p className="text-red-500">Erro ao carregar dados</p>

  const statusChartData = {
    labels: ["Abertos", "Em Andamento", "Aguardando Peças", "Concluídos", "Cancelados"],
    datasets: [{
      label: "Serviços",
      data: [data.servicesOpen, data.servicesInProgress, data.servicesWaitingParts, data.servicesCompleted, data.servicesCancelled],
      backgroundColor: ["#3B82F6", "#F59E0B", "#F97316", "#10B981", "#EF4444"],
    }],
  }

  const financialChartData = {
    labels: ["Diário", "Semanal", "Mensal"],
    datasets: [{
      label: "Faturamento",
      data: [data.dailyRevenue, data.weeklyRevenue, data.monthlyRevenue],
      backgroundColor: ["#3B82F6", "#8B5CF6", "#10B981"],
    }],
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => refetch()}
          className="w-full sm:w-auto px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Atualizar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Serviços Hoje</p>
          <p className="text-2xl font-bold">{data.servicesToday}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Serviços Abertos</p>
          <p className="text-2xl font-bold text-blue-600">{data.servicesOpen}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Em Andamento</p>
          <p className="text-2xl font-bold text-yellow-600">{data.servicesInProgress}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Concluídos</p>
          <p className="text-2xl font-bold text-green-600">{data.servicesCompleted}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Faturamento Hoje</p>
          <p className="text-2xl font-bold">{formatCurrency(data.dailyRevenue)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Faturamento Semana</p>
          <p className="text-2xl font-bold">{formatCurrency(data.weeklyRevenue)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Faturamento Mês</p>
          <p className="text-2xl font-bold">{formatCurrency(data.monthlyRevenue)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Clientes Cadastrados</p>
          <p className="text-2xl font-bold">{data.totalCustomers}</p>
        </Card>
      </div>

      {data.lowStockProducts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">
            ⚠️ {data.lowStockProducts} produto(s) com estoque baixo
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Serviços por Status">
          <div className="h-64">
            <Doughnut data={statusChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </Card>
        <Card title="Faturamento">
          <div className="h-64">
            <Bar data={financialChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </Card>
      </div>

      {data.technicianProductivity.length > 0 && (
        <Card title="Produtividade dos Técnicos (Mês)">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                  <th className="px-4 py-2">Técnico</th>
                  <th className="px-4 py-2">Serviços</th>
                  <th className="px-4 py-2">Valor Produzido</th>
                  <th className="px-4 py-2">Tempo Médio (h)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.technicianProductivity.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2 text-sm">{t.name}</td>
                    <td className="px-4 py-2 text-sm">{t.completedCount}</td>
                    <td className="px-4 py-2 text-sm">{formatCurrency(t.totalValue)}</td>
                    <td className="px-4 py-2 text-sm">{t.avgTimeHours.toFixed(1)}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
