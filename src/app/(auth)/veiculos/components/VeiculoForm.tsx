"use client"

import { useEffect, useState } from "react"
import { Button, Input, Select } from "@/components/ui"
import { toast } from "react-toastify"

type VeiculoFormData = {
  plate: string
  brand: string
  model: string
  year: string
  color: string
  mileage: string
  customerId: string
}

type Props = {
  initialData?: VeiculoFormData & { id: string }
  onSave: (data: VeiculoFormData) => Promise<void>
  loading?: boolean
}

export function VeiculoForm({ initialData, onSave, loading }: Props) {
  const [form, setForm] = useState<VeiculoFormData>({
    plate: initialData?.plate || "",
    brand: initialData?.brand || "",
    model: initialData?.model || "",
    year: initialData?.year || "",
    color: initialData?.color || "",
    mileage: initialData?.mileage || "",
    customerId: initialData?.customerId || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [customers, setCustomers] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    fetch("/api/clientes?pageSize=1000")
      .then((r) => r.json())
      .then((json) => setCustomers(json.data.map((c: any) => ({ value: c.id, label: `${c.name} - ${c.cpf}` }))))
      .catch(() => toast.error("Erro ao carregar clientes"))
  }, [])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.plate.trim()) errs.plate = "Placa é obrigatória"
    if (!form.model.trim()) errs.model = "Modelo é obrigatório"
    if (!form.color.trim()) errs.color = "Cor é obrigatória"
    if (!form.customerId) errs.customerId = "Cliente é obrigatório"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSave({
      ...form,
      year: form.year,
      mileage: form.mileage,
    })
  }

  function setField(field: keyof VeiculoFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Placa *"
          value={form.plate}
          onChange={(e) => setField("plate", e.target.value.toUpperCase())}
          error={errors.plate}
          placeholder="ABC1234 ou ABC1D34"
        />
        <Input
          label="Marca"
          value={form.brand}
          onChange={(e) => setField("brand", e.target.value)}
        />
        <Input
          label="Modelo *"
          value={form.model}
          onChange={(e) => setField("model", e.target.value)}
          error={errors.model}
        />
        <Input
          label="Ano"
          type="number"
          value={form.year}
          onChange={(e) => setField("year", e.target.value)}
        />
        <Input
          label="Cor *"
          value={form.color}
          onChange={(e) => setField("color", e.target.value)}
          error={errors.color}
        />
        <Input
          label="Quilometragem"
          type="number"
          value={form.mileage}
          onChange={(e) => setField("mileage", e.target.value)}
        />
        <div className="md:col-span-2">
          <Select
            label="Cliente *"
            value={form.customerId}
            onChange={(e) => setField("customerId", e.target.value)}
            options={customers}
            placeholder="Selecione um cliente"
            error={errors.customerId}
          />
        </div>
      </div>

      <Button type="submit" loading={loading}>
        {initialData ? "Salvar Alterações" : "Cadastrar Veículo"}
      </Button>
    </form>
  )
}
