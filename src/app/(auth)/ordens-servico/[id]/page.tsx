"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, Button, Badge, Loading, Input, Select, Modal, FormattedText } from "@/components/ui"
import { STATUS_OS, STATUS_OS_COLORS, ALLOWED_STATUS_TRANSITIONS } from "@/lib/utils/constants"
import { formatDate, formatDateTime, formatCurrency } from "@/lib/utils/format"
import { FileDown } from "lucide-react"
import { toast } from "react-toastify"

type ProductItem = { productId: string; description: string; quantity: number; unitPrice: number }

export default function OSDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [os, setOs] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showComplete, setShowComplete] = useState(false)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [productOptions, setProductOptions] = useState<{ value: string; label: string }[]>([])
  const [concludeForm, setConcludeForm] = useState({ diagnostic: "", executedService: "", laborValue: "0" })
  const [concluding, setConcluding] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/ordens-servico/${id}`).then((r) => r.json()),
      fetch("/api/produtos?pageSize=1000&includeInactive=false").then((r) => r.json()),
    ])
      .then(([ordem, prods]) => {
        setOs(ordem)
        setProductOptions(prods.data.map((p: any) => ({
          value: p.id,
          label: `[${p.code}] ${p.description} - R$ ${Number(p.salePrice).toFixed(2)} (Est: ${p.stockQuantity})`,
          salePrice: Number(p.salePrice),
        })))
      })
      .catch(() => toast.error("Erro ao carregar dados"))
      .finally(() => setLoading(false))
  }, [id])

  async function handleStatusChange(newStatus: string) {
    try {
      const res = await fetch(`/api/ordens-servico/status?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro ao atualizar status")
      }
      toast.success("Status atualizado!")
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  function addProduct() {
    setProducts([...products, { productId: "", description: "", quantity: 1, unitPrice: 0 }])
  }

  function updateProduct(index: number, field: keyof ProductItem, value: any) {
    const updated = [...products]
    if (field === "productId") {
      const opt = productOptions.find((p: any) => p.value === value)
      updated[index] = {
        ...updated[index],
        productId: value,
        unitPrice: (opt as any)?.salePrice || 0,
      }
    } else {
      updated[index] = { ...updated[index], [field]: value }
    }
    setProducts(updated)
  }

  function removeProduct(index: number) {
    setProducts(products.filter((_, i) => i !== index))
  }

  async function handleConclude() {
    if (!concludeForm.diagnostic || !concludeForm.executedService || products.length === 0) {
      toast.error("Preencha diagnóstico, serviço executado e adicione ao menos um produto")
      return
    }

    setConcluding(true)
    try {
      const res = await fetch(`/api/ordens-servico/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete",
          diagnostic: concludeForm.diagnostic,
          executedService: concludeForm.executedService,
          laborValue: Number(concludeForm.laborValue),
          products: products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            unitPrice: p.unitPrice,
          })),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erro ao concluir OS")
      }
      toast.success("OS concluída com sucesso!")
      setShowComplete(false)
      window.location.reload()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setConcluding(false)
    }
  }

  if (loading) return <Loading />
  if (!os) return <p className="text-red-500">Ordem não encontrada</p>

  const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[os.status] || []
  const isEditable = os.status !== "COMPLETED" && os.status !== "CANCELLED"

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-2xl font-bold break-words">OS #{os.number}</h1>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.open(`/api/ordens-servico/${id}/pdf`, "_blank")}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            title="Exportar PDF"
          >
            <FileDown size={16} />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <Badge className={`${STATUS_OS_COLORS[os.status]} shrink-0`}>
            {STATUS_OS[os.status as keyof typeof STATUS_OS] || os.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Informações">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Cliente:</dt><dd><FormattedText>{os.customer.name}</FormattedText></dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">CPF:</dt><dd>{os.customer.cpf}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Veículo:</dt><dd><FormattedText>{os.vehicle.brand}</FormattedText> <FormattedText>{os.vehicle.model}</FormattedText> - {os.vehicle.plate}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Técnico:</dt><dd><FormattedText>{os.technician.name}</FormattedText></dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Abertura:</dt><dd>{formatDateTime(os.openingDate)}</dd></div>
            {os.completionDate && <div className="flex justify-between"><dt className="text-gray-500">Conclusão:</dt><dd>{formatDateTime(os.completionDate)}</dd></div>}
            <div className="flex justify-between"><dt className="text-gray-500">Prioridade:</dt><dd className="capitalize">{os.priority}</dd></div>
          </dl>
        </Card>

        <Card title="Valores">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Mão de Obra:</dt><dd>{formatCurrency(os.laborValue)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Materiais:</dt><dd>{formatCurrency(os.materialsValue)}</dd></div>
            <div className="flex justify-between text-base font-bold"><dt>Total:</dt><dd>{formatCurrency(os.totalValue)}</dd></div>
          </dl>
        </Card>
      </div>

      <Card title="Descrição do Problema">
        <p className="text-sm text-gray-700">{os.problemDescription}</p>
      </Card>

      {os.diagnostic && (
        <Card title="Diagnóstico Técnico">
          <p className="text-sm text-gray-700">{os.diagnostic}</p>
        </Card>
      )}

      {os.executedService && (
        <Card title="Serviço Executado">
          <p className="text-sm text-gray-700">{os.executedService}</p>
        </Card>
      )}

      {os.serviceOrderProducts?.length > 0 && (
        <Card title="Produtos Utilizados">
          <table className="min-w-full text-sm">
            <thead><tr className="text-left text-gray-500"><th className="px-2 py-1">Produto</th><th className="px-2 py-1">Qtd</th><th className="px-2 py-1">Valor Unit.</th><th className="px-2 py-1">Total</th></tr></thead>
            <tbody>
              {os.serviceOrderProducts.map((sop: any) => (
                <tr key={sop.id}><td className="px-2 py-1">{sop.product.description}</td><td className="px-2 py-1">{sop.quantity}</td><td className="px-2 py-1">{formatCurrency(sop.unitPrice)}</td><td className="px-2 py-1">{formatCurrency(sop.totalPrice)}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {os.notes && (
        <Card title="Observações">
          <p className="text-sm text-gray-700">{os.notes}</p>
        </Card>
      )}

      <Card title="Histórico de Status">
        <div className="space-y-2">
          {os.statusHistories?.map((h: any) => (
            <div key={h.id} className="flex items-center gap-2 text-sm">
              <Badge className={STATUS_OS_COLORS[h.toStatus]}>
                {STATUS_OS[h.toStatus as keyof typeof STATUS_OS]}
              </Badge>
              <span className="text-gray-500">por {h.changedBy?.name || "Sistema"}</span>
              <span className="text-gray-400">{formatDateTime(h.changedAt)}</span>
            </div>
          ))}
        </div>
      </Card>

      {isEditable && (
        <div className="flex flex-wrap gap-3">
          {allowedTransitions.includes("IN_PROGRESS") && (
            <Button onClick={() => handleStatusChange("IN_PROGRESS")}>Iniciar Atendimento</Button>
          )}
          {allowedTransitions.includes("WAITING_PARTS") && (
            <Button variant="secondary" onClick={() => handleStatusChange("WAITING_PARTS")}>Aguardando Peças</Button>
          )}
          {os.status === "WAITING_PARTS" && (
            <Button variant="secondary" onClick={() => handleStatusChange("IN_PROGRESS")}>Retornar ao Andamento</Button>
          )}
          {(os.status === "IN_PROGRESS" || os.status === "WAITING_PARTS") && (
            <Button onClick={() => setShowComplete(true)}>Concluir OS</Button>
          )}
          {allowedTransitions.includes("CANCELLED") && (
            <Button variant="danger" onClick={() => handleStatusChange("CANCELLED")}>Cancelar OS</Button>
          )}
        </div>
      )}

      <Modal open={showComplete} onClose={() => setShowComplete(false)} title="Concluir Ordem de Serviço" size="lg">
        <div className="space-y-4">
          <Input label="Diagnóstico Técnico *" value={concludeForm.diagnostic} onChange={(e) => setConcludeForm({ ...concludeForm, diagnostic: e.target.value })} as="textarea" className="min-h-[60px]" />
          <Input label="Serviço Executado *" value={concludeForm.executedService} onChange={(e) => setConcludeForm({ ...concludeForm, executedService: e.target.value })} as="textarea" className="min-h-[60px]" />
          <Input label="Valor da Mão de Obra *" type="number" step="0.01" value={concludeForm.laborValue} onChange={(e) => setConcludeForm({ ...concludeForm, laborValue: e.target.value })} />

          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-medium text-sm">Produtos Utilizados *</h4>
              <Button type="button" size="sm" onClick={addProduct} className="shrink-0">+ Adicionar Produto</Button>
            </div>
            {products.map((p, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end mb-3">
                <Select value={p.productId} onChange={(e) => updateProduct(i, "productId", e.target.value)} options={productOptions} placeholder="Produto" className="w-full sm:flex-1" />
                <div className="flex gap-2 items-end">
                  <Input type="number" min="1" value={p.quantity} onChange={(e) => updateProduct(i, "quantity", Number(e.target.value))} className="w-20" placeholder="Qtd" />
                  <Input type="number" step="0.01" value={p.unitPrice} onChange={(e) => updateProduct(i, "unitPrice", Number(e.target.value))} className="w-24" placeholder="R$" />
                  <button type="button" onClick={() => removeProduct(i)} className="text-red-500 text-sm whitespace-nowrap mb-1">Remover</button>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleConclude} loading={concluding} className="w-full">
            Confirmar Conclusão
          </Button>
        </div>
      </Modal>
    </div>
  )
}
