import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import { toTitleCase } from "@/lib/utils/format"

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  header: {
    borderBottom: "2px solid #2563eb",
    paddingBottom: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a5f",
    marginBottom: 2,
  },
  companyInfo: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563eb",
    marginBottom: 4,
  },
  titleNumber: {
    fontSize: 10,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 16,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e3a5f",
    backgroundColor: "#f3f4f6",
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    marginBottom: 2,
  },
  label: {
    width: 100,
    color: "#6b7280",
    fontSize: 9,
  },
  value: {
    flex: 1,
    fontSize: 9,
    color: "#1f2937",
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  gridHalf: {
    flex: 1,
  },
  textBlock: {
    fontSize: 9,
    color: "#1f2937",
    lineHeight: 1.4,
    paddingHorizontal: 8,
  },
  table: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: 8,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 8,
  },
  tableRowEven: {
    backgroundColor: "#f9fafb",
  },
  colProduto: { width: "40%" },
  colQtd: { width: "15%", textAlign: "center" },
  colUnit: { width: "20%", textAlign: "right" },
  colTotal: { width: "25%", textAlign: "right" },
  valuesBox: {
    marginTop: 8,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 6,
    alignItems: "flex-end",
  },
  valueRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 2,
  },
  valueLabel: {
    width: 100,
    fontSize: 9,
    color: "#6b7280",
    textAlign: "right",
    marginRight: 12,
  },
  valueText: {
    width: 80,
    fontSize: 9,
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 4,
    borderTop: "1px solid #1f2937",
    paddingTop: 4,
  },
  totalLabel: {
    width: 100,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
    marginRight: 12,
  },
  totalText: {
    width: 80,
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "right",
  },
  signature: {
    marginTop: 40,
    borderTop: "1px solid #d1d5db",
    paddingTop: 6,
    width: "60%",
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: "#9ca3af",
  },
  statusBadge: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 8,
    fontWeight: "bold",
  },
})

function formatCurrency(value: number | string | null | undefined): string {
  const num = value ? Number(value) : 0
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num)
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-"
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("pt-BR")
}

function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-"
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("pt-BR")
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    OPEN: "Aberta",
    IN_PROGRESS: "Em Andamento",
    WAITING_PARTS: "Aguardando Peças",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
  }
  return labels[status] || status
}

type Props = {
  os: any
  company: any
}

export function OSPDFDocument({ os, company }: Props) {
  const hasProducts = os.serviceOrderProducts?.length > 0
  const isComplete = os.status === "COMPLETED" || os.status === "CANCELLED"

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{company?.name || "App Serviço"}</Text>
            {company?.cnpj && <Text style={styles.companyInfo}>CNPJ: {company.cnpj}</Text>}
            {company?.phone && <Text style={styles.companyInfo}>Tel: {company.phone}</Text>}
            {company?.email && <Text style={styles.companyInfo}>Email: {company.email}</Text>
            && company?.street && <Text style={styles.companyInfo}>
              {company.street}, {company.number} - {company.neighborhood}, {company.city}/{company.state}
            </Text>}
          </View>
          <Text style={styles.statusBadge}>{getStatusLabel(os.status)}</Text>
        </View>

        <Text style={styles.title}>ORDEM DE SERVIÇO</Text>
        <Text style={styles.titleNumber}>Nº {os.number}</Text>

        <View style={styles.grid}>
          <View style={styles.gridHalf}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informações da OS</Text>
              <View style={styles.row}><Text style={styles.label}>Abertura:</Text><Text style={styles.value}>{formatDateTime(os.openingDate)}</Text></View>
              {os.completionDate && <View style={styles.row}><Text style={styles.label}>Conclusão:</Text><Text style={styles.value}>{formatDateTime(os.completionDate)}</Text></View>}
              <View style={styles.row}><Text style={styles.label}>Prioridade:</Text><Text style={styles.value}>{os.priority || "Normal"}</Text></View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Cliente</Text>
              <View style={styles.row}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>{toTitleCase(os.customer.name)}</Text></View>
              {os.customer.cpf && <View style={styles.row}><Text style={styles.label}>CPF:</Text><Text style={styles.value}>{os.customer.cpf}</Text></View>}
              {os.customer.phone && <View style={styles.row}><Text style={styles.label}>Telefone:</Text><Text style={styles.value}>{os.customer.phone}</Text></View>}
              {os.customer.email && <View style={styles.row}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{os.customer.email}</Text></View>}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Veículo</Text>
              <View style={styles.row}><Text style={styles.label}>Modelo:</Text><Text style={styles.value}>{toTitleCase(os.vehicle.model)} - {os.vehicle.plate}</Text></View>
              {os.vehicle.brand && <View style={styles.row}><Text style={styles.label}>Marca:</Text><Text style={styles.value}>{toTitleCase(os.vehicle.brand)}</Text></View>}
              {os.vehicle.year && <View style={styles.row}><Text style={styles.label}>Ano:</Text><Text style={styles.value}>{os.vehicle.year}</Text></View>}
              {os.vehicle.color && <View style={styles.row}><Text style={styles.label}>Cor:</Text><Text style={styles.value}>{toTitleCase(os.vehicle.color)}</Text></View>}
            </View>
          </View>

          <View style={styles.gridHalf}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Técnico Responsável</Text>
              <View style={styles.row}><Text style={styles.label}>Nome:</Text><Text style={styles.value}>{toTitleCase(os.technician.name)}</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição do Problema</Text>
          <Text style={styles.textBlock}>{os.problemDescription}</Text>
        </View>

        {os.diagnostic && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diagnóstico Técnico</Text>
            <Text style={styles.textBlock}>{os.diagnostic}</Text>
          </View>
        )}

        {os.executedService && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Serviço Executado</Text>
            <Text style={styles.textBlock}>{os.executedService}</Text>
          </View>
        )}

        {hasProducts && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Produtos Utilizados</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={styles.colProduto}>Produto</Text>
                <Text style={styles.colQtd}>Qtd</Text>
                <Text style={styles.colUnit}>Valor Unit.</Text>
                <Text style={styles.colTotal}>Total</Text>
              </View>
              {os.serviceOrderProducts.map((sop: any, idx: number) => (
                <View key={sop.id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowEven : {}]}>
                  <Text style={styles.colProduto}>{sop.product.description}</Text>
                  <Text style={styles.colQtd}>{sop.quantity}</Text>
                  <Text style={styles.colUnit}>{formatCurrency(sop.unitPrice)}</Text>
                  <Text style={styles.colTotal}>{formatCurrency(sop.totalPrice)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {isComplete && (
          <View style={styles.valuesBox}>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Mão de Obra:</Text>
              <Text style={styles.valueText}>{formatCurrency(os.laborValue)}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Materiais:</Text>
              <Text style={styles.valueText}>{formatCurrency(os.materialsValue)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalText}>{formatCurrency(os.totalValue)}</Text>
            </View>
          </View>
        )}

        {os.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <Text style={styles.textBlock}>{os.notes}</Text>
          </View>
        )}

        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
          <Text style={styles.signature}>
            Assinatura do Cliente{'\n'}{'\n'}{'\n'}
            {company?.name && `${company.name} - `}Emitido em: {new Date().toLocaleDateString("pt-BR")}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>App Serviço - Sistema de Gestão de Oficina</Text>
          <Text>Página 1</Text>
        </View>
      </Page>
    </Document>
  )
}
