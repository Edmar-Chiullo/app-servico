import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import { STATUS_OS } from "@/lib/utils/constants"
import { toTitleCase, formatCurrency } from "@/lib/utils/format"
import { formatDateBR } from "@/lib/utils/date"

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  header: {
    borderBottom: "2px solid #2563eb",
    paddingBottom: 10,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e3a5f",
    marginBottom: 2,
  },
  companyInfo: {
    fontSize: 7,
    color: "#6b7280",
    marginBottom: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563eb",
    marginBottom: 14,
  },
  table: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: 7,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 3,
    paddingHorizontal: 4,
    fontSize: 7,
  },
  tableRowEven: {
    backgroundColor: "#f9fafb",
  },
  colNumero: { width: "6%" },
  colCliente: { width: "16%" },
  colVeiculo: { width: "14%" },
  colPlaca: { width: "8%" },
  colTecnico: { width: "12%" },
  colStatus: { width: "10%" },
  colAbertura: { width: "8%" },
  colConclusao: { width: "8%" },
  colMObra: { width: "6%", textAlign: "right" },
  colMateriais: { width: "6%", textAlign: "right" },
  colTotal: { width: "6%", textAlign: "right" },
  summary: {
    marginTop: 16,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  summaryItem: {
    marginRight: 20,
    fontSize: 8,
  },
  summaryLabel: {
    color: "#6b7280",
  },
  summaryValue: {
    fontWeight: "bold",
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 6,
    color: "#9ca3af",
  },
})

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "-"
  return formatDateBR(d, "date")
}

type Props = {
  ordens: any[]
  company: any
  totalRevenue: number
  totalCount: number
  completedCount: number
}

export function RelatorioPDFDocument({ ordens, company, totalRevenue, totalCount, completedCount }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{company?.name || "App Serviço"}</Text>
            {company?.cnpj && <Text style={styles.companyInfo}>CNPJ: {company.cnpj}</Text>}
            {company?.phone && <Text style={styles.companyInfo}>Tel: {company.phone}</Text>}
          </View>
        </View>

        <Text style={styles.title}>Relatório de Ordens de Serviço</Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNumero}>Nº</Text>
            <Text style={styles.colCliente}>Cliente</Text>
            <Text style={styles.colVeiculo}>Veículo</Text>
            <Text style={styles.colPlaca}>Placa</Text>
            <Text style={styles.colTecnico}>Técnico</Text>
            <Text style={styles.colStatus}>Situação</Text>
            <Text style={styles.colAbertura}>Abertura</Text>
            <Text style={styles.colConclusao}>Conclusão</Text>
            <Text style={styles.colMObra}>M. Obra</Text>
            <Text style={styles.colMateriais}>Materiais</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>

          {ordens.map((o: any, idx: number) => (
            <View key={o.id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowEven : {}]}>
              <Text style={styles.colNumero}>#{o.number}</Text>
              <Text style={styles.colCliente}>{toTitleCase(o.customer?.name || "")}</Text>
              <Text style={styles.colVeiculo}>{toTitleCase(o.vehicle?.brand || "")} {toTitleCase(o.vehicle?.model)}</Text>
              <Text style={styles.colPlaca}>{o.vehicle?.plate}</Text>
              <Text style={styles.colTecnico}>{toTitleCase(o.technician?.name)}</Text>
              <Text style={styles.colStatus}>{STATUS_OS[o.status as keyof typeof STATUS_OS] || o.status}</Text>
              <Text style={styles.colAbertura}>{formatDate(o.openingDate)}</Text>
              <Text style={styles.colConclusao}>{formatDate(o.completionDate)}</Text>
              <Text style={styles.colMObra}>{formatCurrency(o.laborValue)}</Text>
              <Text style={styles.colMateriais}>{formatCurrency(o.materialsValue)}</Text>
              <Text style={styles.colTotal}>{formatCurrency(o.totalValue)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total de OS: </Text>
            <Text style={styles.summaryValue}>{totalCount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Concluídas: </Text>
            <Text style={styles.summaryValue}>{completedCount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Receita Total: </Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalRevenue)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>App Serviço - Sistema de Gestão de Oficina</Text>
          <Text>Página 1</Text>
        </View>
      </Page>
    </Document>
  )
}
