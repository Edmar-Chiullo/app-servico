import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { listLowStockProducts } from "@/lib/services/produto"
import { toTitleCase } from "@/lib/utils/format"
import * as XLSX from "xlsx"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const products = await listLowStockProducts()

  const rows = products.map((p) => ({
    "Código": p.code,
    "Descrição": toTitleCase(p.description),
    "Categoria": p.category ? toTitleCase(p.category) : "-",
    "Estoque Atual": p.stockQuantity,
    "Estoque Mínimo": p.stockMin,
    "Unidade": p.unit,
    "Preço Custo": p.costPrice,
    "Preço Venda": p.salePrice,
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(wb, ws, "Estoque Baixo")

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=estoque-baixo-${new Date().toISOString().split("T")[0]}.xlsx`,
    },
  })
}
