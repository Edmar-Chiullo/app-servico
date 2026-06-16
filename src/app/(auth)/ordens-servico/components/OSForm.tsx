"use client"

import { useState } from "react"
import { Button, Input, Select, Combobox } from "@/components/ui"
import type { ComboboxItem } from "@/components/ui/Combobox"

type OSFormData = {
  customerName: string
  vehiclePlate: string
  vehicleModel: string
  vehicleColor: string
  technicianId: string
  problemDescription: string
  priority: string
  notes: string
}

type Props = {
  onSave: (data: OSFormData) => Promise<void>
  loading?: boolean
}

export function OSForm({ onSave, loading }: Props) {
  const [form, setForm] = useState<OSFormData>({
    customerName: "",
    vehiclePlate: "",
    vehicleModel: "",
    vehicleColor: "",
    technicianId: "",
    problemDescription: "",
    priority: "normal",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedTechnicianLabel, setSelectedTechnicianLabel] = useState("")

  async function fetchTechnicians(search: string): Promise<ComboboxItem[]> {
    const res = await fetch(`/api/tecnicos?search=${encodeURIComponent(search)}&pageSize=20&includeInactive=false`)
    const json = await res.json()
    return json.data.map((t: any) => ({ value: t.id, label: t.name }))
  }

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.customerName.trim()) errs.customerName = "Nome do cliente é obrigatório"
    if (!form.vehiclePlate.trim()) errs.vehiclePlate = "Placa é obrigatória"
    if (!form.vehicleModel.trim()) errs.vehicleModel = "Modelo é obrigatório"
    if (!form.vehicleColor.trim()) errs.vehicleColor = "Cor é obrigatória"
    if (!form.technicianId) errs.technicianId = "Técnico é obrigatório"
    if (!form.problemDescription.trim()) errs.problemDescription = "Descrição do problema é obrigatória"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSave(form)
  }

  function setField(field: keyof OSFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome do Cliente *"
          value={form.customerName}
          onChange={(e) => setField("customerName", e.target.value)}
          error={errors.customerName}
          autoFocus
        />
        <Input
          label="Placa do Veículo *"
          value={form.vehiclePlate}
          onChange={(e) => setField("vehiclePlate", e.target.value.toUpperCase().slice(0, 7))}
          error={errors.vehiclePlate}
          placeholder="ABC1234"
        />
        <Input
          label="Modelo do Veículo *"
          value={form.vehicleModel}
          onChange={(e) => setField("vehicleModel", e.target.value)}
          error={errors.vehicleModel}
        />
        <Input
          label="Cor do Veículo *"
          value={form.vehicleColor}
          onChange={(e) => setField("vehicleColor", e.target.value)}
          error={errors.vehicleColor}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Técnico *</label>
          <Combobox
            placeholder="Buscar técnico..."
            value={selectedTechnicianLabel}
            onSelect={(item) => {
              setField("technicianId", item.value)
              setSelectedTechnicianLabel(item.label)
            }}
            fetchItems={fetchTechnicians}
          />
          {errors.technicianId && <p className="text-xs text-red-500 mt-1">{errors.technicianId}</p>}
        </div>
        <Select
          label="Prioridade"
          value={form.priority}
          onChange={(e) => setField("priority", e.target.value)}
          options={[
            { value: "baixa", label: "Baixa" },
            { value: "normal", label: "Normal" },
            { value: "alta", label: "Alta" },
            { value: "urgente", label: "Urgente" },
          ]}
        />
      </div>

      <Input
        label="Descrição do Problema *"
        value={form.problemDescription}
        onChange={(e) => setField("problemDescription", e.target.value)}
        error={errors.problemDescription}
        as="textarea"
        className="min-h-[80px]"
      />

      <Input
        label="Observações"
        value={form.notes}
        onChange={(e) => setField("notes", e.target.value)}
        as="textarea"
        className="min-h-[60px]"
      />

      <Button type="submit" loading={loading}>
        Abrir Ordem de Serviço
      </Button>
    </form>
  )
}
