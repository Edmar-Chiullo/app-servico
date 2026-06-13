"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, Loading, Badge, Table } from "@/components/ui"
import { formatDateTime } from "@/lib/utils/format"
import { ProdutoForm } from "../components/ProdutoForm"
import { toast } from "react-toastify"

export default function EditarProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`/api/produtos/${id}`)
        if (!res.ok) throw new Error("Produto não encontrado")
        const json = await res.json()
        if (mounted) setProduto(json)
      } catch (err: any) {
        if (mounted) toast.error(err.message)
        if (mounted) router.push("/produtos")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id, router])

  async function handleSave(data: any) {
    setSaving(true)
    try {
      const res = await fetch(`/api/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Produto atualizado!")
      router.push("/produtos")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
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
          onSave={handleSave}
          loading={saving}
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
