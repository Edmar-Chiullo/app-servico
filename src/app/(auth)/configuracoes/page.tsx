"use client"

import { useEffect, useState } from "react"
import { Card, Button, Input, Loading } from "@/components/ui"
import { toast } from "react-toastify"

type CompanyData = {
  name: string
  logo: string
  cnpj: string
  phone: string
  email: string
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export default function ConfiguracoesPage() {
  const [form, setForm] = useState<CompanyData>({
    name: "", logo: "", cnpj: "", phone: "", email: "",
    street: "", number: "", neighborhood: "", city: "", state: "", zipCode: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/configuracoes")
      .then((r) => r.json())
      .then((data) => {
        if (data) setForm(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Configurações salvas!")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  function setField(field: keyof CompanyData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <Card title="Dados da Empresa">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome da Empresa" value={form.name} onChange={(e) => setField("name", e.target.value)} />
            <Input label="Logo (URL)" value={form.logo} onChange={(e) => setField("logo", e.target.value)} />
            <Input label="CNPJ" value={form.cnpj} onChange={(e) => setField("cnpj", e.target.value)} />
            <Input label="Telefone" value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
            <Input label="Email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
            <Input label="Rua" value={form.street} onChange={(e) => setField("street", e.target.value)} />
            <Input label="Número" value={form.number} onChange={(e) => setField("number", e.target.value)} />
            <Input label="Bairro" value={form.neighborhood} onChange={(e) => setField("neighborhood", e.target.value)} />
            <Input label="Cidade" value={form.city} onChange={(e) => setField("city", e.target.value)} />
            <Input label="Estado" value={form.state} onChange={(e) => setField("state", e.target.value)} maxLength={2} />
            <Input label="CEP" value={form.zipCode} onChange={(e) => setField("zipCode", e.target.value)} />
          </div>
          <Button type="submit" loading={saving}>Salvar Configurações</Button>
        </form>
      </Card>
    </div>
  )
}
