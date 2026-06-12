"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, Button, Input, Combobox, Select, BarcodeScanner } from "@/components/ui"
import type { ComboboxItem } from "@/components/ui/Combobox"
import { toast } from "react-toastify"

export default function MovimentacoesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedProductLabel, setSelectedProductLabel] = useState("")
  const [showScanner, setShowScanner] = useState(false)
  const [form, setForm] = useState({
    productId: "",
    type: "IN",
    quantity: "1",
    reason: "",
  })

  async function fetchProducts(search: string): Promise<ComboboxItem[]> {
    const res = await fetch(`/api/produtos?search=${encodeURIComponent(search)}`)
    const json = await res.json()
    return json.data.map((p: any) => ({
      value: p.id,
      label: `${p.description} - ${p.code}`,
    }))
  }

  function handleProductSelect(item: ComboboxItem) {
    setForm((prev) => ({ ...prev, productId: item.value }))
    setSelectedProductLabel(item.label)
  }

  async function handleScan(scannedCode: string) {
    setShowScanner(false)
    try {
      const res = await fetch(`/api/produtos?search=${encodeURIComponent(scannedCode)}`)
      const json = await res.json()
      const product = json.data.find((p: any) => p.code === scannedCode)

      if (product) {
        setForm((prev) => ({ ...prev, productId: product.id }))
        setSelectedProductLabel(`${product.description} - ${product.code}`)
        toast.success(`Produto "${product.description}" selecionado!`)
      } else {
        const toastId = toast.warning(
          <div>
            <p className="mb-2">
              Produto com código <strong>{scannedCode}</strong> não encontrado.
            </p>
            <button
              onClick={() => {
                router.push("/produtos/novo")
                toast.dismiss(toastId)
              }}
              className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Cadastrar Produto
            </button>
          </div>,
          { autoClose: false }
        )
      }
    } catch {
      toast.error("Erro ao buscar produto")
    }
  }

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
      setSelectedProductLabel("")
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
          <div>
            <label className="block text-sm font-medium mb-1">Produto *</label>
            <Combobox
              placeholder="Buscar produto..."
              value={selectedProductLabel}
              fetchItems={fetchProducts}
              onSelect={handleProductSelect}
              showCamera
              onCameraClick={() => setShowScanner(true)}
            />
          </div>
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

      <BarcodeScanner
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onDetected={handleScan}
      />
    </div>
  )
}
