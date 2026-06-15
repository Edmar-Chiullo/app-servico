"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { Card, Table, Pagination, Input, Button, FormattedText, Loading } from "@/components/ui"

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
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["veiculos", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set("search", search)
      const res = await fetch(`/api/veiculos?${params}`)
      if (!res.ok) throw new Error("Erro ao carregar")
      return res.json()
    },
    placeholderData: keepPreviousData,
  })

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
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Table
              columns={[
                { key: "plate", header: "Placa" },
                { key: "model", header: "Modelo", render: (v: Veiculo) => <FormattedText>{v.model}</FormattedText> },
                { key: "brand", header: "Marca", render: (v: Veiculo) => v.brand ? <FormattedText>{v.brand}</FormattedText> : "-" },
                { key: "color", header: "Cor", render: (v: Veiculo) => <FormattedText>{v.color}</FormattedText> },
                { key: "year", header: "Ano", render: (v: Veiculo) => v.year || "-" },
                { key: "customer", header: "Cliente", render: (v: Veiculo) => <FormattedText>{v.customer?.name}</FormattedText> },
              ]}
              data={data?.data ?? []}
              onRowClick={(v) => router.push(`/veiculos/${v.id}`)}
            />
            <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  )
}
