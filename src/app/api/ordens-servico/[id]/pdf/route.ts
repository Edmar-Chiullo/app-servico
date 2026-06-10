import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { getOrdemById } from "@/lib/services/ordem-servico"
import { prisma } from "@/lib/prisma"
import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { OSPDFDocument } from "@/components/relatorios/OSPDFDocument"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  const os = await getOrdemById(id)
  if (!os) return NextResponse.json({ error: "Ordem não encontrada" }, { status: 404 })

  const company = await prisma.companySettings.findUnique({ where: { id: "default" } })

  const pdfBuffer = await renderToBuffer(
    React.createElement(OSPDFDocument, { os, company }) as any
  )

  const uint8 = new Uint8Array(pdfBuffer)

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="os-${os.number}.pdf"`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  })
}
