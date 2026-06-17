"use client"

import { useState } from "react"
import { Card, Button, Input, Select } from "@/components/ui"
export default function RelatoriosPage() {
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
  })

  function buildParams(): URLSearchParams {
    const params = new URLSearchParams()
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
    if (filters.dateTo) params.set("dateTo", filters.dateTo)
    if (filters.status) params.set("status", filters.status)
    return params
  }

  function downloadXLSX() {
    window.open(`/api/relatorios/xlsx?${buildParams()}`, "_blank")
  }

  function downloadPDF() {
    window.open(`/api/relatorios/pdf?${buildParams()}`, "_blank")
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Relatórios</h1>

      <Card title="Filtros">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            label="Data Início"
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          />
          <Input
            label="Data Fim"
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          />
          <Select
            label="Status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            options={[
              { value: "OPEN", label: "Aberto" },
              { value: "IN_PROGRESS", label: "Em Andamento" },
              { value: "COMPLETED", label: "Concluído" },
              { value: "CANCELLED", label: "Cancelado" },
            ]}
            placeholder="Todos"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={downloadXLSX} fullWidth>
            Exportar XLSX
          </Button>
          <Button variant="secondary" onClick={downloadPDF} fullWidth>
            Exportar PDF
          </Button>
        </div>
      </Card>
    </div>
  )
}
