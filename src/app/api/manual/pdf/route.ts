import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { UserRole } from "@/lib/enums"
import { prisma } from "@/lib/prisma"
import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { ManualPDFDocument } from "@/components/relatorios/ManualPDFDocument"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const perm = requireRole(user, [UserRole.ADMIN, UserRole.MANAGER])
  if (!perm.allowed) return NextResponse.json({ error: perm.error }, { status: 403 })

  const company = await prisma.companySettings.findFirst().catch(() => null)

  const pdfBuffer = await renderToBuffer(
    React.createElement(ManualPDFDocument as any, { company: { name: company?.name, logo: company?.logo } }) as any
  )

  const uint8 = new Uint8Array(pdfBuffer)

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=manual-do-usuario.pdf`,
      "Content-Length": pdfBuffer.length.toString(),
    },
  })
}
