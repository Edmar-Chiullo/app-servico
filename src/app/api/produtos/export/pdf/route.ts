import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { listLowStockProducts } from "@/lib/services/produto"
import { prisma } from "@/lib/prisma"
import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { ProdutosLowStockPDFDocument } from "@/components/relatorios/ProdutosLowStockPDFDocument"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const [products, company] = await Promise.all([
    listLowStockProducts(),
    prisma.companySettings.findUnique({ where: { id: "default" } }),
  ])

  const pdfBuffer = await renderToBuffer(
    React.createElement(ProdutosLowStockPDFDocument, { products, company }) as any
  )

  const uint8 = new Uint8Array(pdfBuffer)

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="estoque-baixo-${new Date().toISOString().split("T")[0]}.pdf"`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  })
}
