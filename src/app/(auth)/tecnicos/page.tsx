"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { Card, Table, Pagination, Input, Button, Badge, FormattedText, Loading } from "@/components/ui"

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
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["tecnicos", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set("search", search)
      const res = await fetch(`/api/tecnicos?${params}`)
      if (!res.ok) throw new Error("Erro ao carregar")
      return res.json()
    },
    placeholderData: keepPreviousData,
  })

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
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Table
              columns={[
                { key: "name", header: "Nome", render: (t: Tecnico) => <FormattedText>{t.name}</FormattedText> },
                { key: "cpf", header: "CPF" },
                { key: "role", header: "Cargo", render: (t: Tecnico) => <FormattedText>{t.role}</FormattedText> },
                { key: "phone", header: "Telefone", render: (t: Tecnico) => t.phone || "-" },
                {
                  key: "active",
                  header: "Status",
                  render: (t: Tecnico) => t.active
                    ? <Badge variant="success">Ativo</Badge>
                    : <Badge variant="danger">Inativo</Badge>,
                },
              ]}
              data={data?.data ?? []}
              onRowClick={(t) => router.push(`/tecnicos/${t.id}`)}
            />
            <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  )
}
