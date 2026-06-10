import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { listClientes, createCliente } from "@/lib/services/cliente"
import { clienteSchema } from "@/lib/validations/cliente"

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || undefined
  const page = Number(searchParams.get("page") || "1")
  const includeInactive = searchParams.get("includeInactive") === "true"

  const result = await listClientes({ search, page, includeInactive })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const body = await req.json()
  const parsed = clienteSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const cliente = await createCliente(parsed.data, user.id)

  return NextResponse.json(cliente, { status: 201 })
}
