"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, Table, Pagination, Input, Button, Badge, FormattedText } from "@/components/ui"
import { ROLE_LABELS } from "@/lib/utils/constants"
import { toast } from "react-toastify"

type Usuario = {
  id: string
  name: string | null
  email: string | null
  role: string
  active: boolean
  createdAt: string
}

export default function UsuariosPage() {
  const router = useRouter()
  const [data, setData] = useState<Usuario[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), includeInactive: "true" })
      if (search) params.set("search", search)
      const res = await fetch(`/api/usuarios?${params}`)
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
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Button onClick={() => router.push("/usuarios/novo")} fullWidth>
          Novo Usuário
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full sm:flex-1"
          />
        </div>

        <Table
          columns={[
            { key: "name", header: "Nome", render: (u: Usuario) => u.name ? <FormattedText>{u.name}</FormattedText> : "-" },
            { key: "email", header: "Email" },
            {
              key: "role",
              header: "Perfil",
              render: (u: Usuario) => (
                <Badge>{ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] || u.role}</Badge>
              ),
            },
            {
              key: "active",
              header: "Status",
              render: (u: Usuario) => (
                <Badge className={u.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {u.active ? "Ativo" : "Inativo"}
                </Badge>
              ),
            },
          ]}
          data={data}
          onRowClick={(u) => router.push(`/usuarios/${u.id}`)}
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  )
}
