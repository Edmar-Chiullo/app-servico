"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { Card, Table, Pagination, Input, Button, Badge, FormattedText, Loading } from "@/components/ui"
import { formatCurrency } from "@/lib/utils/format"

type Produto = {
  id: string
  code: string
  description: string
  category: string | null
  unit: string
  stockQuantity: number
  stockMin: number
  stockMax: number
  costPrice: number
  salePrice: number
  active: boolean
}

export default function ProdutosPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [lowStock, setLowStock] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ["produtos", page, search, lowStock],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set("search", search)
      if (lowStock) params.set("lowStock", "true")
      const res = await fetch(`/api/produtos?${params}`)
      if (!res.ok) throw new Error("Erro ao carregar")
      return res.json()
    },
    placeholderData: keepPreviousData,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={() => router.push("/produtos/movimentacoes")} fullWidth>
            Movimentações
          </Button>
          <Button onClick={() => router.push("/produtos/novo")} fullWidth>Novo Produto</Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar por código ou descrição..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={lowStock}
                onChange={(e) => { setLowStock(e.target.checked); setPage(1) }}
                className="rounded border-gray-300"
              />
              Estoque baixo
            </label>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open("/api/produtos/export/xlsx")}
            disabled={!data?.data?.length}
          >
            Exportar XLSX
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open("/api/produtos/export/pdf")}
            disabled={!data?.data?.length}
          >
            Exportar PDF
          </Button>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Table
              columns={[
                { key: "code", header: "Código" },
                { key: "description", header: "Descrição", render: (p: Produto) => <FormattedText>{p.description}</FormattedText> },
                { key: "category", header: "Categoria", render: (p: Produto) => p.category ? <FormattedText>{p.category}</FormattedText> : "-" },
                { key: "stockQuantity", header: "Estoque",
                  render: (p: Produto) => (
                    <span className={p.stockQuantity <= p.stockMin ? "text-red-600 font-bold" : ""}>
                      {p.stockQuantity} {p.unit}
                    </span>
                  ),
                },
                { key: "salePrice", header: "Venda", render: (p: Produto) => formatCurrency(p.salePrice) },
                {
                  key: "active",
                  header: "Status",
                  render: (p: Produto) => p.active
                    ? <Badge variant="success">Ativo</Badge>
                    : <Badge variant="danger">Inativo</Badge>,
                },
              ]}
              data={data?.data ?? []}
              onRowClick={(p) => router.push(`/produtos/${p.id}`)}
            />
            <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  )
}
