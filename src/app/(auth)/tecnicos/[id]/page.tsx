"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, Loading, Button } from "@/components/ui"
import { TecnicoForm } from "../components/TecnicoForm"
import { toast } from "react-toastify"

export default function EditarTecnicoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [tecnico, setTecnico] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/tecnicos/${id}`)
        if (!res.ok) throw new Error("Técnico não encontrado")
        const json = await res.json()
        setTecnico(json)
      } catch (err: any) {
        toast.error(err.message)
        router.push("/tecnicos")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  async function handleSave(data: any) {
    setSaving(true)
    try {
      const res = await fetch(`/api/tecnicos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Técnico atualizado!")
      router.push("/tecnicos")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (!tecnico) return null

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Editar Técnico</h1>
      <Card>
        <TecnicoForm
          initialData={{
            id: tecnico.id,
            name: tecnico.name,
            cpf: tecnico.cpf,
            role: tecnico.role,
            phone: tecnico.phone || "",
            active: tecnico.active,
          }}
          onSave={handleSave}
          loading={saving}
        />
      </Card>
    </div>
  )
}
