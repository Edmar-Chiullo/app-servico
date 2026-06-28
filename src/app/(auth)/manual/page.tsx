"use client"

import { Card, Button } from "@/components/ui"
import { Book } from "lucide-react"

export default function ManualPage() {
  function downloadManual() {
    window.open("/api/manual/pdf", "_blank")
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Manual do Usuário</h1>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Book size={24} className="text-blue-600 shrink-0" />
            <p className="text-sm text-gray-600">
              Baixe o manual completo do sistema com instruções detalhadas sobre
              todos os módulos, campos, fluxos e funcionalidades do App Serviço.
            </p>
          </div>
          <Button onClick={downloadManual} fullWidth>
            Baixar Manual do Usuário (PDF)
          </Button>
        </div>
      </Card>
    </div>
  )
}
