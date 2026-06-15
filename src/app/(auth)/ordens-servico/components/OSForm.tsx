"use client"

import { useEffect, useState } from "react"
import { Button, Input, Select, Combobox } from "@/components/ui"
import type { ComboboxItem } from "@/components/ui/Combobox"
import { toast } from "react-toastify"

type OSFormData = {
  customerId: string
  vehicleId: string
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
    customerId: "",
    vehicleId: "",
    technicianId: "",
    problemDescription: "",
    priority: "normal",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [vehicles, setVehicles] = useState<{ value: string; label: string }[]>([])
  const [selectedCustomerLabel, setSelectedCustomerLabel] = useState("")
  const [selectedTechnicianLabel, setSelectedTechnicianLabel] = useState("")

  async function fetchCustomers(search: string): Promise<ComboboxItem[]> {
    const res = await fetch(`/api/clientes?search=${encodeURIComponent(search)}&pageSize=20&includeInactive=false`)
    const json = await res.json()
    return json.data.map((c: any) => ({ value: c.id, label: `${c.name} - ${c.cpf}` }))
  }

  async function fetchTechnicians(search: string): Promise<ComboboxItem[]> {
    const res = await fetch(`/api/tecnicos?search=${encodeURIComponent(search)}&pageSize=20&includeInactive=false`)
    const json = await res.json()
    return json.data.map((t: any) => ({ value: t.id, label: t.name }))
  }

  useEffect(() => {
    if (form.customerId) {
      fetch(`/api/veiculos?customerId=${form.customerId}&pageSize=100`)
        .then((r) => r.json())
        .then((json) => {
          setVehicles(json.data.map((v: any) => ({
            value: v.id,
            label: `${v.model} - ${v.plate} (${v.color})`,
          })))
        })
        .catch(() => toast.error("Erro ao carregar veículos"))
      setForm((prev) => ({ ...prev, vehicleId: "" }))
    }
  }, [form.customerId])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.customerId) errs.customerId = "Cliente é obrigatório"
    if (!form.vehicleId) errs.vehicleId = "Veículo é obrigatório"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
          <Combobox
            placeholder="Buscar cliente por nome ou CPF..."
            value={selectedCustomerLabel}
            onSelect={(item) => {
              setField("customerId", item.value)
              setSelectedCustomerLabel(item.label)
            }}
            fetchItems={fetchCustomers}
          />
          {errors.customerId && <p className="text-xs text-red-500 mt-1">{errors.customerId}</p>}
        </div>
        <Select
          label="Veículo *"
          value={form.vehicleId}
          onChange={(e) => setField("vehicleId", e.target.value)}
          options={vehicles}
          placeholder={form.customerId ? "Selecione um veículo" : "Selecione um cliente primeiro"}
          error={errors.vehicleId}
          disabled={!form.customerId}
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
