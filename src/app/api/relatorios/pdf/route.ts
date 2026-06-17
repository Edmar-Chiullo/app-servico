import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { getRelatorioData } from "@/lib/services/relatorio"
import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { RelatorioPDFDocument } from "@/components/relatorios/RelatorioPDFDocument"

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

  const pdfBuffer = await renderToBuffer(
    React.createElement(RelatorioPDFDocument, {
      ordens: data.ordens,
      company: data.company,
      totalRevenue: data.totalRevenue,
      totalCount: data.totalCount,
      completedCount: data.completedCount,
    }) as any
  )

  const uint8 = new Uint8Array(pdfBuffer)

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=relatorio-${new Date().toISOString().split("T")[0]}.pdf`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  })
}
