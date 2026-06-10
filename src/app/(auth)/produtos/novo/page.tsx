"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui"
import { ProdutoForm } from "../components/ProdutoForm"
import { toast } from "react-toastify"

export default function NovoProdutoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSave(data: any) {
    setLoading(true)
    try {
      const res = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao cadastrar")
      toast.success("Produto cadastrado!")
      router.push("/produtos")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Novo Produto</h1>
      <Card>
        <ProdutoForm onSave={handleSave} loading={loading} />
      </Card>
    </div>
  )
}
