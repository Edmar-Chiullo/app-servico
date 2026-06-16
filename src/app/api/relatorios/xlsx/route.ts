import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { getRelatorioData } from "@/lib/services/relatorio"
import { toTitleCase } from "@/lib/utils/format"
import * as XLSX from "xlsx"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const filters = {
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    customerId: searchParams.get("customerId") || undefined,
    technicianId: searchParams.get("technicianId") || undefined,
    status: searchParams.get("status") || undefined,
  }

  const data = await getRelatorioData(filters)

  const rows = data.ordens.map((o) => ({
    "Nº OS": o.number,
    "Cliente": toTitleCase(o.customer?.name || ""),
    "CPF": o.customer?.cpf || "",
    "Veículo": `${toTitleCase(o.vehicle.brand || "")} ${toTitleCase(o.vehicle.model)} - ${o.vehicle.plate}`,
    "Técnico": toTitleCase(o.technician.name),
    "Status": o.status,
    "Abertura": o.openingDate.toLocaleDateString("pt-BR"),
    "Conclusão": o.completionDate?.toLocaleDateString("pt-BR") || "-",
    "Valor M. Obra": Number(o.laborValue),
    "Valor Materiais": Number(o.materialsValue),
    "Valor Total": Number(o.totalValue),
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(wb, ws, "Relatório")

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=relatorio-${new Date().toISOString().split("T")[0]}.xlsx`,
    },
  })
}
