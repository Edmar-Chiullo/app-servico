"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, Loading } from "@/components/ui"
import { UsuarioForm } from "../components/UsuarioForm"
import { toast } from "react-toastify"

export default function EditarUsuarioPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [usuario, setUsuario] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/usuarios/${id}`)
        if (!res.ok) throw new Error("Usuário não encontrado")
        const json = await res.json()
        setUsuario(json)
      } catch (err: any) {
        toast.error(err.message)
        router.push("/usuarios")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  async function handleSave(data: any) {
    setSaving(true)
    try {
      const res = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error?.fieldErrors ? Object.values(err.error.fieldErrors).flat()[0] : err.error || "Erro ao salvar")
      }
      toast.success("Usuário atualizado!")
      router.push("/usuarios")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (!usuario) return null

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Editar Usuário</h1>
      <Card>
        <UsuarioForm
          initialData={{
            id: usuario.id,
            name: usuario.name || "",
            email: usuario.email || "",
            password: "",
            role: usuario.role,
            active: usuario.active,
          }}
          onSave={handleSave}
          loading={saving}
        />
      </Card>
    </div>
  )
}
