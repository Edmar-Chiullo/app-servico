"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, Table, Pagination, Input, Button, Badge } from "@/components/ui"
import { toast } from "react-toastify"

type Tecnico = {
  id: string
  name: string
  cpf: string
  role: string
  phone: string | null
  active: boolean
}

export default function TecnicosPage() {
  const router = useRouter()
  const [data, setData] = useState<Tecnico[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set("search", search)
      const res = await fetch(`/api/tecnicos?${params}`)
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
        <h1 className="text-2xl font-bold">Técnicos</h1>
        <Button onClick={() => router.push("/tecnicos/novo")} fullWidth>Novo Técnico</Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <Table
          columns={[
            { key: "name", header: "Nome" },
            { key: "cpf", header: "CPF" },
            { key: "role", header: "Cargo" },
            { key: "phone", header: "Telefone", render: (t: Tecnico) => t.phone || "-" },
            {
              key: "active",
              header: "Status",
              render: (t: Tecnico) => t.active
                ? <Badge variant="success">Ativo</Badge>
                : <Badge variant="danger">Inativo</Badge>,
            },
          ]}
          data={data}
          onRowClick={(t) => router.push(`/tecnicos/${t.id}`)}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  )
}
