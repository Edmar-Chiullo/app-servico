import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { listProdutos, createProduto } from "@/lib/services/produto"
import { produtoSchema } from "@/lib/validations/produto"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || undefined
  const page = Number(searchParams.get("page") || "1")
  const lowStock = searchParams.get("lowStock") === "true"

  const result = await listProdutos({ search, page, lowStock })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const body = await req.json()
  const parsed = produtoSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const produto = await createProduto(parsed.data, user.id)
  return NextResponse.json(produto, { status: 201 })
}
