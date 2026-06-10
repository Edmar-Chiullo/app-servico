"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, Table, Pagination, Input, Button, Badge } from "@/components/ui"
import { formatCurrency } from "@/lib/utils/format"
import { toast } from "react-toastify"

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
  const [data, setData] = useState<Produto[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set("search", search)
      const res = await fetch(`/api/produtos?${params}`)
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
        <h1 className="text-2xl font-bold">Produtos</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={() => router.push("/produtos/movimentacoes")} fullWidth>
            Movimentações
          </Button>
          <Button onClick={() => router.push("/produtos/novo")} fullWidth>Novo Produto</Button>
        </div>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Buscar por código ou descrição..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Table
          columns={[
            { key: "code", header: "Código" },
            { key: "description", header: "Descrição" },
            { key: "category", header: "Categoria", render: (p: Produto) => p.category || "-" },
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
          data={data}
          onRowClick={(p) => router.push(`/produtos/${p.id}`)}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  )
}
