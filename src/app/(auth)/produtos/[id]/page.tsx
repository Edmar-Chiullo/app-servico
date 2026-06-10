"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, Loading } from "@/components/ui"
import { ProdutoForm } from "../components/ProdutoForm"
import { toast } from "react-toastify"

export default function EditarProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [produto, setProduto] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/produtos/${id}`)
        if (!res.ok) throw new Error("Produto não encontrado")
        const json = await res.json()
        setProduto(json)
      } catch (err: any) {
        toast.error(err.message)
        router.push("/produtos")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, router])

  async function handleSave(data: any) {
    setSaving(true)
    try {
      const res = await fetch(`/api/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erro ao salvar")
      toast.success("Produto atualizado!")
      router.push("/produtos")
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading />
  if (!produto) return null

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Editar Produto</h1>
      <Card>
        <ProdutoForm
          initialData={{
            id: produto.id,
            code: produto.code,
            description: produto.description,
            category: produto.category || "",
            unit: produto.unit,
            stockQuantity: String(produto.stockQuantity),
            stockMin: String(produto.stockMin),
            stockMax: String(produto.stockMax),
            costPrice: String(produto.costPrice),
            salePrice: String(produto.salePrice),
            active: produto.active,
          }}
          onSave={handleSave}
          loading={saving}
        />
      </Card>
    </div>
  )
}
