import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, requireRole } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@/lib/enums"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const permission = requireRole(user, [UserRole.ADMIN])
  if (!permission.allowed) {
    return NextResponse.json({ error: "Apenas administradores" }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("logo") as File | null

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Arquivo deve ser uma imagem" }, { status: 400 })
    }

    const MAX_SIZE = 2 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Imagem muito grande. Máximo 2MB" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    await prisma.companySettings.upsert({
      where: { id: "default" },
      update: { logo: base64 },
      create: { id: "default", name: "App Serviço", logo: base64 },
    })

    return NextResponse.json({ logo: base64 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erro ao fazer upload" }, { status: 500 })
  }
}

export async function DELETE() {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const permission = requireRole(user, [UserRole.ADMIN])
  if (!permission.allowed) {
    return NextResponse.json({ error: "Apenas administradores" }, { status: 403 })
  }

  await prisma.companySettings.update({
    where: { id: "default" },
    data: { logo: null },
  })

  return NextResponse.json({ logo: null })
}
