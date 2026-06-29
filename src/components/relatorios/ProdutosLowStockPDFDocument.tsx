import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import { toTitleCase } from "@/lib/utils/format"
import { formatDateBR } from "@/lib/utils/date"

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  header: {
    borderBottom: "2px solid #dc2626",
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
    color: "#dc2626",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    color: "#6b7280",
    marginBottom: 16,
  },
  summary: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 12,
  },
  table: {
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#dc2626",
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
    backgroundColor: "#fef2f2",
  },
  colCode: { width: "15%" },
  colDesc: { width: "35%" },
  colCategory: { width: "15%" },
  colStock: { width: "12%", textAlign: "center" },
  colMin: { width: "10%", textAlign: "center" },
  colUnit: { width: "13%", textAlign: "center" },
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
})

type Props = {
  products: any[]
  company: any
}

export function ProdutosLowStockPDFDocument({ products, company }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{company?.name || "App Serviço"}</Text>
            {company?.cnpj && <Text style={styles.companyInfo}>CNPJ: {company.cnpj}</Text>}
            {company?.phone && <Text style={styles.companyInfo}>Tel: {company.phone}</Text>}
            {company?.email && <Text style={styles.companyInfo}>Email: {company.email}</Text>}
          </View>
        </View>

        <Text style={styles.title}>RELATÓRIO DE ESTOQUE BAIXO</Text>
        <Text style={styles.subtitle}>
          Produtos com estoque igual ou abaixo do mínimo
        </Text>
        <Text style={styles.summary}>
          {products.length} produto(s) encontrado(s) em {formatDateBR(new Date(), "date")}
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colCode}>Código</Text>
            <Text style={styles.colDesc}>Descrição</Text>
            <Text style={styles.colCategory}>Categoria</Text>
            <Text style={styles.colStock}>Estoque</Text>
            <Text style={styles.colMin}>Mínimo</Text>
            <Text style={styles.colUnit}>Unidade</Text>
          </View>
          {products.map((p: any, idx: number) => (
            <View key={p.id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowEven : {}]}>
              <Text style={styles.colCode}>{p.code}</Text>
              <Text style={styles.colDesc}>{toTitleCase(p.description)}</Text>
              <Text style={styles.colCategory}>{p.category ? toTitleCase(p.category) : "-"}</Text>
              <Text style={styles.colStock}>{p.stockQuantity}</Text>
              <Text style={styles.colMin}>{p.stockMin}</Text>
              <Text style={styles.colUnit}>{p.unit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>App Serviço - Sistema de Gestão de Oficina</Text>
          <Text>Página 1</Text>
        </View>
      </Page>
    </Document>
  )
}
