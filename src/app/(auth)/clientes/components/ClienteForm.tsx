"use client"

import { useState } from "react"
import { Button, Input, Select } from "@/components/ui"
import { isValidCPF } from "@/lib/utils/cpf"
import { toInternationalFormat } from "@/lib/utils/phone"
import { toast } from "react-toastify"

type ClienteFormData = {
  name: string
  cpf: string
  phone: string
  whatsapp: string
  email: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  active: boolean
}

type Props = {
  initialData?: ClienteFormData & { id: string }
  onSave: (data: ClienteFormData) => Promise<void>
  loading?: boolean
}

const UF_OPTIONS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
].map((uf) => ({ value: uf, label: uf }))

export function ClienteForm({ initialData, onSave, loading }: Props) {
  const [form, setForm] = useState<ClienteFormData>({
    name: initialData?.name || "",
    cpf: initialData?.cpf || "",
    phone: initialData?.phone || "",
    whatsapp: initialData?.whatsapp || "",
    email: initialData?.email || "",
    street: initialData?.street || "",
    number: initialData?.number || "",
    neighborhood: initialData?.neighborhood || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
    active: initialData?.active ?? true,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = "Nome é obrigatório"
    if (!form.cpf || !isValidCPF(form.cpf)) errs.cpf = "CPF inválido"
    if (!form.phone) errs.phone = "Telefone é obrigatório"
    if (form.state && form.state.length !== 2) errs.state = "Use a sigla (2 letras)"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const payload = {
      ...form,
      phone: toInternationalFormat(form.phone),
      whatsapp: form.whatsapp ? toInternationalFormat(form.whatsapp) : "",
    }
    await onSave(payload)
  }

  function setField(field: keyof ClienteFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome Completo *"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
          error={errors.name}
          autoFocus
        />
        <Input
          label="CPF *"
          value={form.cpf}
          onChange={(e) => setField("cpf", e.target.value.replace(/\D/g, "").slice(0, 11))}
          error={errors.cpf}
          placeholder="Apenas números"
        />
        <Input
          label="Telefone *"
          value={form.phone}
          onChange={(e) => setField("phone", e.target.value)}
          error={errors.phone}
          placeholder="+55 (11) 99999-9999"
        />
        <Input
          label="WhatsApp"
          value={form.whatsapp}
          onChange={(e) => setField("whatsapp", e.target.value)}
          placeholder="+55 (11) 99999-9999"
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
        />
      </div>

      <h3 className="font-medium text-gray-900">Endereço</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Rua"
          value={form.street}
          onChange={(e) => setField("street", e.target.value)}
        />
        <Input
          label="Número"
          value={form.number}
          onChange={(e) => setField("number", e.target.value)}
        />
        <Input
          label="Bairro"
          value={form.neighborhood}
          onChange={(e) => setField("neighborhood", e.target.value)}
        />
        <Input
          label="Cidade"
          value={form.city}
          onChange={(e) => setField("city", e.target.value)}
        />
        <Select
          label="Estado"
          value={form.state}
          onChange={(e) => setField("state", e.target.value)}
          options={UF_OPTIONS}
          placeholder="Selecione"
          error={errors.state}
        />
        <Input
          label="CEP"
          value={form.zipCode}
          onChange={(e) => setField("zipCode", e.target.value.replace(/\D/g, "").slice(0, 8))}
          placeholder="Apenas números"
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
          <label htmlFor="active" className="text-sm text-gray-700">Cliente Ativo</label>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" loading={loading} fullWidth>
          {initialData ? "Salvar Alterações" : "Cadastrar Cliente"}
        </Button>
      </div>
    </form>
  )
}
