"use client"

import { useState } from "react"
import { Button, Input, BarcodeScanner } from "@/components/ui"
import { Camera } from "lucide-react"

type ProdutoFormData = {
  code: string
  description: string
  category: string
  unit: string
  stockQuantity: string
  stockMin: string
  stockMax: string
  costPrice: string
  salePrice: string
  active: boolean
}

type Props = {
  initialData?: ProdutoFormData & { id: string }
  onSave: (data: any) => Promise<void>
  loading?: boolean
}

export function ProdutoForm({ initialData, onSave, loading }: Props) {
  const [form, setForm] = useState<ProdutoFormData>({
    code: initialData?.code || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    unit: initialData?.unit || "UN",
    stockQuantity: initialData?.stockQuantity || "0",
    stockMin: initialData?.stockMin || "0",
    stockMax: initialData?.stockMax || "0",
    costPrice: initialData?.costPrice || "0",
    salePrice: initialData?.salePrice || "0",
    active: initialData?.active ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showScanner, setShowScanner] = useState(false)

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.code.trim()) errs.code = "Código é obrigatório"
    if (!form.description.trim()) errs.description = "Descrição é obrigatória"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSave({
      ...form,
      stockQuantity: Number(form.stockQuantity),
      stockMin: Number(form.stockMin),
      stockMax: Number(form.stockMax),
      costPrice: Number(form.costPrice),
      salePrice: Number(form.salePrice),
    })
  }

  function setField(field: keyof ProdutoFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                label="Código *"
                value={form.code}
                onChange={(e) => setField("code", e.target.value)}
                error={errors.code}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="shrink-0 inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors mt-[26px]"
              title="Escanear código de barras"
            >
              <Camera size={16} />
            </button>
          </div>
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
        </div>
        <Input
          label="Descrição *"
          value={form.description}
          onChange={(e) => setField("description", e.target.value)}
          error={errors.description}
        />
        <Input
          label="Categoria"
          value={form.category}
          onChange={(e) => setField("category", e.target.value)}
        />
        <Input
          label="Unidade"
          value={form.unit}
          onChange={(e) => setField("unit", e.target.value)}
        />
        <Input
          label="Estoque Atual"
          type="number"
          value={form.stockQuantity}
          onChange={(e) => setField("stockQuantity", e.target.value)}
        />
        <Input
          label="Estoque Mínimo"
          type="number"
          value={form.stockMin}
          onChange={(e) => setField("stockMin", e.target.value)}
        />
        <Input
          label="Estoque Máximo"
          type="number"
          value={form.stockMax}
          onChange={(e) => setField("stockMax", e.target.value)}
        />
        <Input
          label="Valor de Custo (R$)"
          type="number"
          step="0.01"
          value={form.costPrice}
          onChange={(e) => setField("costPrice", e.target.value)}
        />
        <Input
          label="Valor de Venda (R$)"
          type="number"
          step="0.01"
          value={form.salePrice}
          onChange={(e) => setField("salePrice", e.target.value)}
        />
      </div>

      {initialData && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="active"
            checked={form.active}
            onChange={(e) => setField("active", e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="active" className="text-sm text-gray-700">Produto Ativo</label>
        </div>
      )}

      <Button type="submit" loading={loading}>
        {initialData ? "Salvar Alterações" : "Cadastrar Produto"}
      </Button>

      <BarcodeScanner
        open={showScanner}
        onClose={() => setShowScanner(false)}
        onDetected={(code) => {
          setField("code", code)
          setShowScanner(false)
        }}
      />
    </form>
  )
}
