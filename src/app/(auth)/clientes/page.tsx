"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { Card, Table, Pagination, Input, Badge, FormattedText, Loading } from "@/components/ui"
import { formatPhone } from "@/lib/utils/phone"

type Cliente = {
  id: string
  name: string
  cpf: string | null
  phone: string | null
  whatsapp: string | null
  email: string | null
  active: boolean
  createdAt: string
  vehicles: { id: string; plate: string; model: string }[]
}

export default function ClientesPage() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const { data, isLoading } = useQuery({
    queryKey: ["clientes", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) })
      if (search) params.set("search", search)
      const res = await fetch(`/api/clientes?${params}`)
      if (!res.ok) throw new Error("Erro ao carregar")
      return res.json()
    },
    placeholderData: keepPreviousData,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
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
                { key: "name", header: "Nome", render: (c: Cliente) => <FormattedText>{c.name}</FormattedText> },
                { key: "contato", header: "Contato", render: (c: Cliente) => formatPhone(c.whatsapp || c.phone || "") || "-" },
                { key: "veiculo", header: "Veículo", render: (c: Cliente) => c.vehicles?.[0] ? <FormattedText>{c.vehicles[0].model}</FormattedText> : "-" },
                { key: "placa", header: "Placa", render: (c: Cliente) => c.vehicles?.[0]?.plate || "-" },
                {
                  key: "active",
                  header: "Status",
                  render: (c: Cliente) => c.active
                    ? <Badge variant="success">Ativo</Badge>
                    : <Badge variant="danger">Inativo</Badge>,
                },
              ]}
              data={data?.data ?? []}
              onRowClick={(c) => router.push(`/clientes/${c.id}`)}
            />

            <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  )
}
