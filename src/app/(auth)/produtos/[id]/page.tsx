"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, Loading, Badge, Table } from "@/components/ui"
import { formatDateTime } from "@/lib/utils/format"
import { ProdutoForm } from "../components/ProdutoForm"
import { toast } from "react-toastify"

export default function EditarProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const queryClient = useQueryClient()

  const { data: produto, isLoading } = useQuery({
    queryKey: ["produto", id],
    queryFn: async () => {
      const res = await fetch(`/api/produtos/${id}`)
      if (!res.ok) throw new Error("Produto não encontrado")
      return res.json()
    },
  })

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      return res.json()
    },
    onSuccess: () => {
      toast.success("Produto atualizado!")
      queryClient.invalidateQueries({ queryKey: ["produto", id] })
      queryClient.invalidateQueries({ queryKey: ["produtos"] })
      router.push("/produtos")
    },
    onError: (err: any) => {
      toast.error(err.message)
    },
  })

  if (isLoading) return <Loading />
  if (!produto) return null

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Editar Produto</h1>
      <Card>
        <ProdutoForm
          initialData={{
            id: produto.id,
            code: produto.code,
            description: produto.description,
            category: produto.category || "",
            unit: produto.unit,
            stockQuantity: String(produto.stockQuantity),
            stockMin: String(produto.stockMin),
            stockMax: String(produto.stockMax),
            costPrice: String(produto.costPrice),
            salePrice: String(produto.salePrice),
            active: produto.active,
          }}
          onSave={async (data) => saveMutation.mutateAsync(data)}
          loading={saveMutation.isPending}
        />
      </Card>

      <Card title="Movimentações de Estoque">
        {produto.stockMovements?.length > 0 ? (
          <Table
            columns={[
              {
                key: "createdAt",
                header: "Data",
                render: (m: any) => formatDateTime(m.createdAt),
              },
              {
                key: "type",
                header: "Tipo",
                render: (m: any) => {
                  const map: Record<string, { label: string; variant: "success" | "danger" | "warning" | "info" }> = {
                    IN: { label: "Entrada", variant: "success" },
                    OUT: { label: "Saída", variant: "danger" },
                    ADJUSTMENT: { label: "Ajuste", variant: "warning" },
                    SERVICE_ORDER: { label: "OS", variant: "info" },
                  }
                  const cfg = map[m.type] || { label: m.type, variant: "default" as const }
                  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
                },
              },
              {
                key: "quantity",
                header: "Quantidade",
                render: (m: any) => `${m.quantity} ${produto.unit}`,
              },
              {
                key: "reason",
                header: "Motivo",
                render: (m: any) =>
                  m.type === "SERVICE_ORDER" && m.order
                    ? `OS #${m.order.number}`
                    : m.reason,
              },
              {
                key: "user",
                header: "Responsável",
                render: (m: any) => m.user?.name || "-",
              },
            ]}
            data={produto.stockMovements}
          />
        ) : (
          <p className="text-sm text-gray-500">Nenhuma movimentação registrada.</p>
        )}
      </Card>
    </div>
  )
}
