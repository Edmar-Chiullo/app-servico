"use client"

import { useState } from "react"
import { Button, Input, Select } from "@/components/ui"
import { ROLE_LABELS } from "@/lib/utils/constants"
import { UserRole } from "@/lib/enums"

type UsuarioFormData = {
  name: string
  email: string
  password: string
  role: string
  active: boolean
}

type Props = {
  initialData?: UsuarioFormData & { id: string }
  onSave: (data: UsuarioFormData) => Promise<void>
  loading?: boolean
}

export function UsuarioForm({ initialData, onSave, loading }: Props) {
  const [form, setForm] = useState<UsuarioFormData>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || UserRole.ATTENDANT,
    active: initialData?.active ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "Nome é obrigatório"
    if (!form.email.trim()) errs.email = "Email é obrigatório"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email inválido"
    if (!initialData && !form.password) errs.password = "Senha é obrigatória"
    else if (form.password && form.password.length < 6) errs.password = "Senha deve ter no mínimo 6 caracteres"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    await onSave(form)
  }

  function setField(field: keyof UsuarioFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }))

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
          label="Email *"
          type="email"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          error={errors.email}
        />
        <Input
          label={initialData ? "Nova Senha (deixe em branco para manter)" : "Senha *"}
          type="password"
          value={form.password}
          onChange={(e) => setField("password", e.target.value)}
          error={errors.password}
        />
        <Select
          label="Perfil *"
          value={form.role}
          onChange={(e) => setField("role", e.target.value)}
          options={roleOptions}
          placeholder="Selecione o perfil"
          error={errors.role}
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
          <label htmlFor="active" className="text-sm text-gray-700">Usuário Ativo</label>
        </div>
      )}

      <Button type="submit" loading={loading}>
        {initialData ? "Salvar Alterações" : "Cadastrar Usuário"}
      </Button>
    </form>
  )
}
