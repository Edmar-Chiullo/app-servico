"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, Table, Pagination, Input, Button } from "@/components/ui"
import { toast } from "react-toastify"

type Veiculo = {
  id: string
  plate: string
  brand: string | null
  model: string
  year: number | null
  color: string
  customer: { id: string; name: string }
}

export default function VeiculosPage() {
  const router = useRouter()
  const [data, setData] = useState<Veiculo[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set("search", search)
      const res = await fetch(`/api/veiculos?${params}`)
      if (!res.ok) throw new Error("Erro ao carregar")
      const json = await res.json()
      setData(json.data)
      setTotalPages(json.totalPages)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => { loadData() }, [loadData])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Veículos</h1>
        <Button onClick={() => router.push("/veiculos/novo")} fullWidth>Novo Veículo</Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Buscar por placa, modelo ou cor..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Table
          columns={[
            { key: "plate", header: "Placa" },
            { key: "model", header: "Modelo" },
            { key: "brand", header: "Marca", render: (v: Veiculo) => v.brand || "-" },
            { key: "color", header: "Cor" },
            { key: "year", header: "Ano", render: (v: Veiculo) => v.year || "-" },
            { key: "customer", header: "Cliente", render: (v: Veiculo) => v.customer.name },
          ]}
          data={data}
          onRowClick={(v) => router.push(`/veiculos/${v.id}`)}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  )
}
