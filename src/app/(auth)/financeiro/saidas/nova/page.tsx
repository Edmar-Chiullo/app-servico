"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, Button, Input } from "@/components/ui"
import { toast } from "react-toastify"

export default function NovaSaidaPage() {
  const router = useRouter()
  const [form, setForm] = useState({ description: "", value: "", date: new Date().toISOString().split("T")[0] })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.description || !form.value) {
      toast.error("Preencha todos os campos")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/financeiro/saidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Erro ao registrar saída")
      toast.success("Saída registrada!")
      router.push("/financeiro")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Nova Saída Financeira</h1>
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <Input
            label="Descrição *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Valor *"
            type="number"
            step="0.01"
            min="0.01"
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
          />
          <Input
            label="Data"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <Button type="submit" loading={loading}>
            Registrar Saída
          </Button>
        </form>
      </Card>
    </div>
  )
}
