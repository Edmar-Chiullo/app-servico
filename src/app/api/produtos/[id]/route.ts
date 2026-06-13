import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { getProduto, updateProduto } from "@/lib/services/produto"
import { produtoSchema } from "@/lib/validations/produto"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  const produto = await getProduto(id)
  if (!produto) return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })

  return NextResponse.json(produto)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { id } = await params
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }
  const parsed = produtoSchema.partial().safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const produto = await updateProduto(id, parsed.data, user.id)
  return NextResponse.json(produto)
}
