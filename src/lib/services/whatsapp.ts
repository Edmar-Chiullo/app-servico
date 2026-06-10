import { prisma } from "../prisma"

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || ""
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY || ""
const EVOLUTION_INSTANCE = process.env.EVOLUTION_INSTANCE || ""

type WhatsAppCheckResult = {
  exists: boolean
}

type WhatsAppSendResult = {
  success: boolean
  status: string
  error?: string
}

async function checkWhatsApp(phone: string): Promise<WhatsAppCheckResult> {
  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/instance/${EVOLUTION_INSTANCE}/contact/check`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": EVOLUTION_API_KEY,
        },
        body: JSON.stringify({ number: phone.replace(/\D/g, "") }),
      }
    )
    if (!response.ok) return { exists: false }
    const data = await response.json()
    return { exists: data.exists ?? false }
  } catch {
    return { exists: false }
  }
}

async function sendMessage(phone: string, message: string): Promise<WhatsAppSendResult> {
  try {
    const response = await fetch(
      `${EVOLUTION_API_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": EVOLUTION_API_KEY,
        },
        body: JSON.stringify({
          number: phone.replace(/\D/g, ""),
          text: message,
        }),
      }
    )

    if (!response.ok) {
      return { success: false, status: "failed", error: `HTTP ${response.status}` }
    }

    const data = await response.json()
    return { success: true, status: data.status || "sent" }
  } catch (err: any) {
    return { success: false, status: "error", error: err.message }
  }
}

export async function sendWelcomeMessage(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  })

  if (!customer) throw new Error("Cliente não encontrado")
  if (!customer.whatsapp) return null

  const check = await checkWhatsApp(customer.whatsapp)
  if (!check.exists) return null

  const message = `Olá ${customer.name}! Seja bem-vindo(a) à nossa oficina. Estamos prontos para atender você.`
  const result = await sendMessage(customer.whatsapp, message)

  const record = await prisma.whatsAppMessage.create({
    data: {
      customerId,
      phone: customer.whatsapp,
      message,
      status: result.success ? "sent" : "failed",
      sentAt: new Date(),
    },
  })

  return record
}

export async function getMessageHistory(customerId: string) {
  return prisma.whatsAppMessage.findMany({
    where: { customerId },
    orderBy: { sentAt: "desc" },
  })
}
