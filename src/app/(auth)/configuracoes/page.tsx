"use client"

import { useEffect, useState, useRef } from "react"
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
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let mounted = true
    fetch("/api/configuracoes")
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return
        if (data) {
          setForm({
            name: data.name || "",
            logo: data.logo || "",
            cnpj: data.cnpj || "",
            phone: data.phone || "",
            email: data.email || "",
            street: data.street || "",
            number: data.number || "",
            neighborhood: data.neighborhood || "",
            city: data.city || "",
            state: data.state || "",
            zipCode: data.zipCode || "",
          })
        }
      })
      .catch(() => { toast.error("Erro ao carregar configurações") })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
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

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Arquivo deve ser uma imagem")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem muito grande. Máximo 2MB")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("logo", file)

      const res = await fetch("/api/configuracoes/logo", {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro ao enviar")
      }
      const data = await res.json()
      setForm((prev) => ({ ...prev, logo: data.logo }))
      toast.success("Logo atualizada!")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  async function handleRemoveLogo() {
    setUploading(true)
    try {
      const res = await fetch("/api/configuracoes/logo", { method: "DELETE" })
      if (!res.ok) throw new Error("Erro ao remover")
      setForm((prev) => ({ ...prev, logo: "" }))
      toast.success("Logo removida!")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  function setField(field: keyof CompanyData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  if (loading) return <Loading />

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Configurações</h1>

      <Card title="Logo da Empresa">
        <div className="space-y-4">
          {form.logo && (
            <div className="flex items-start gap-4">
              <img src={form.logo} alt="Logo" className="w-20 h-20 object-contain border rounded-md" />
              <div className="text-sm text-gray-500">
                <p>Logo atual</p>
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-red-500 hover:text-red-700 text-sm mt-1"
                  disabled={uploading}
                >
                  Remover logo
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <span className="text-sm text-gray-500">Enviando...</span>}
          </div>
          <p className="text-xs text-gray-400">Formatos aceitos: PNG, JPG, WEBP. Máximo 2MB.</p>
        </div>
      </Card>

      <Card title="Dados da Empresa">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome da Empresa" value={form.name} onChange={(e) => setField("name", e.target.value)} />
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
