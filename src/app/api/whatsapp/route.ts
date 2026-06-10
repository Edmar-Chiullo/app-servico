import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/permissions"
import { sendWelcomeMessage, getMessageHistory } from "@/lib/services/whatsapp"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const body = await req.json()
  const { customerId } = body

  if (!customerId) {
    return NextResponse.json({ error: "customerId é obrigatório" }, { status: 400 })
  }

  try {
    const result = await sendWelcomeMessage(customerId)
    return NextResponse.json({ sent: !!result, data: result })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const customerId = searchParams.get("customerId")

  if (!customerId) {
    return NextResponse.json({ error: "customerId é obrigatório" }, { status: 400 })
  }

  const messages = await getMessageHistory(customerId)
  return NextResponse.json(messages)
}
