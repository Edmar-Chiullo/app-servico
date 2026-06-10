"use client"

import { useState } from "react"
import { Card, Button, Input, Select } from "@/components/ui"
import { toast } from "react-toastify"

export default function MovimentacoesPage() {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<{ value: string; label: string }[]>([])
  const [form, setForm] = useState({
    productId: "",
    type: "IN",
    quantity: "1",
    reason: "",
  })

  useState(() => {
    fetch("/api/produtos?pageSize=1000")
      .then((r) => r.json())
      .then((json) => setProducts(json.data.map((p: any) => ({
        value: p.id,
        label: `[${p.code}] ${p.description} (Estoque: ${p.stockQuantity})`,
      }))))
      .catch(() => toast.error("Erro ao carregar produtos"))
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.productId || !form.reason) {
      toast.error("Preencha todos os campos")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/produtos/movimentacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: form.productId,
          type: form.type,
          quantity: Number(form.quantity),
          reason: form.reason,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro ao registrar movimentação")
      }
      toast.success("Movimentação registrada!")
      setForm({ productId: "", type: "IN", quantity: "1", reason: "" })
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Movimentação de Estoque</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <Select
            label="Produto *"
            value={form.productId}
            onChange={(e) => setForm({ ...form, productId: e.target.value })}
            options={products}
            placeholder="Selecione um produto"
          />
          <Select
            label="Tipo *"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={[
              { value: "IN", label: "Entrada" },
              { value: "OUT", label: "Saída" },
              { value: "ADJUSTMENT", label: "Ajuste" },
            ]}
          />
          <Input
            label="Quantidade *"
            type="number"
            min="1"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <Input
            label="Motivo *"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
          <Button type="submit" loading={loading}>
            Registrar Movimentação
          </Button>
        </form>
      </Card>
    </div>
  )
}
