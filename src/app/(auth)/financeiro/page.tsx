"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, Button, Loading } from "@/components/ui"
import { formatCurrency, formatDate } from "@/lib/utils/format"
import { toast } from "react-toastify"
import type { FinanceiroData, FinanceiroEntry, FinanceiroExit } from "@/types"

export default function FinanceiroPage() {
  const router = useRouter()
  const [data, setData] = useState<FinanceiroData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/financeiro")
        if (!res.ok) throw new Error("Erro ao carregar")
        const json = await res.json()
        setData(json)
      } catch (err: any) {
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Loading />
  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <Button onClick={() => router.push("/financeiro/saidas/nova")} fullWidth>Nova Saída</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-gray-500">Entradas (hoje)</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(data.summary?.revenue || 0)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Saídas (hoje)</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(data.summary?.expenses || 0)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Saldo</p>
          <p className={`text-2xl font-bold ${(data.summary?.balance || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(data.summary?.balance || 0)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Últimas Entradas">
          {data.entries?.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma entrada</p>
          ) : (
            <div className="space-y-2">
              {data.entries?.map((e: FinanceiroEntry) => (
                <div key={e.id} className="flex justify-between text-sm">
                  <span>OS #{e.serviceOrder?.number} - {e.serviceOrder?.customer?.name}</span>
                  <span className="text-green-600 font-medium">{formatCurrency(e.value)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Últimas Saídas" action={
          <Button size="sm" onClick={() => router.push("/financeiro/saidas/nova")}>Nova</Button>
        }>
          {data.exits?.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma saída</p>
          ) : (
            <div className="space-y-2">
              {data.exits?.map((e: FinanceiroExit) => (
                <div key={e.id} className="flex justify-between text-sm">
                  <div>
                    <span>{e.description}</span>
                    <span className="text-gray-400 ml-2">{formatDate(e.date)}</span>
                  </div>
                  <span className="text-red-600 font-medium">{formatCurrency(e.value)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
