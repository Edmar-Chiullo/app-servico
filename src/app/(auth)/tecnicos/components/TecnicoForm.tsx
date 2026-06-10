"use client"

import { useState } from "react"
import { Button, Input } from "@/components/ui"
import { isValidCPF } from "@/lib/utils/cpf"

type TecnicoFormData = {
  name: string
  cpf: string
  role: string
  phone: string
  active: boolean
}

type Props = {
  initialData?: TecnicoFormData & { id: string }
  onSave: (data: TecnicoFormData) => Promise<void>
  loading?: boolean
}

export function TecnicoForm({ initialData, onSave, loading }: Props) {
  const [form, setForm] = useState<TecnicoFormData>({
    name: initialData?.name || "",
    cpf: initialData?.cpf || "",
    role: initialData?.role || "",
    phone: initialData?.phone || "",
    active: initialData?.active ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "Nome é obrigatório"
    if (!form.cpf || !isValidCPF(form.cpf)) errs.cpf = "CPF inválido"
    if (!form.role.trim()) errs.role = "Cargo é obrigatório"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSave(form)
  }

  function setField(field: keyof TecnicoFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome *"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          error={errors.name}
        />
        <Input
          label="CPF *"
          value={form.cpf}
          onChange={(e) => setField("cpf", e.target.value.replace(/\D/g, "").slice(0, 11))}
          error={errors.cpf}
          placeholder="Apenas números"
        />
        <Input
          label="Cargo *"
          value={form.role}
          onChange={(e) => setField("role", e.target.value)}
          error={errors.role}
        />
        <Input
          label="Telefone"
          value={form.phone}
          onChange={(e) => setField("phone", e.target.value)}
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
          <label htmlFor="active" className="text-sm text-gray-700">Técnico Ativo</label>
        </div>
      )}

      <Button type="submit" loading={loading}>
        {initialData ? "Salvar Alterações" : "Cadastrar Técnico"}
      </Button>
    </form>
  )
}
