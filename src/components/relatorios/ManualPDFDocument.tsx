import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer"

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
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
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e3a5f",
  },
  headerSub: {
    fontSize: 7,
    color: "#6b7280",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
  chapterTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1e3a5f",
    backgroundColor: "#f3f4f6",
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 8,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
    marginTop: 8,
  },
  text: {
    fontSize: 8,
    color: "#1f2937",
    lineHeight: 1.5,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  bullet: {
    fontSize: 8,
    color: "#1f2937",
    lineHeight: 1.5,
    marginBottom: 2,
    paddingLeft: 16,
  },
  table: {
    marginTop: 4,
    marginBottom: 8,
    marginHorizontal: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    fontSize: 7,
    fontWeight: "bold",
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 2.5,
    paddingHorizontal: 4,
    fontSize: 7,
  },
  tableRowEven: {
    backgroundColor: "#f9fafb",
  },
  colRole: { width: "25%" },
  colDesc: { width: "75%" },
  colField: { width: "25%" },
  colType: { width: "15%" },
  colReq: { width: "10%" },
  colNotes: { width: "50%" },
  colStatus: { width: "20%" },
  colLabel: { width: "25%" },
  colColor: { width: "25%" },
  colTransition: { width: "30%" },
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
  pageBreak: {
    marginTop: 20,
  },
  note: {
    fontSize: 7,
    color: "#6b7280",
    fontStyle: "italic",
    paddingHorizontal: 8,
    marginBottom: 4,
  },
})

function RoleRow({ role, desc }: { role: string; desc: string }) {
  return (
    <View style={styles.tableRow}>
      <Text style={styles.colRole}>{role}</Text>
      <Text style={styles.colDesc}>{desc}</Text>
    </View>
  )
}

function FieldRow({ field, type, req, notes }: { field: string; type: string; req: string; notes: string }) {
  return (
    <View style={styles.tableRow}>
      <Text style={styles.colField}>{field}</Text>
      <Text style={styles.colType}>{type}</Text>
      <Text style={styles.colReq}>{req}</Text>
      <Text style={styles.colNotes}>{notes}</Text>
    </View>
  )
}

function StatusRow({ status, label, color, transition }: { status: string; label: string; color: string; transition: string }) {
  return (
    <View style={styles.tableRow}>
      <Text style={styles.colStatus}>{status}</Text>
      <Text style={styles.colLabel}>{label}</Text>
      <Text style={styles.colColor}>{color}</Text>
      <Text style={styles.colTransition}>{transition}</Text>
    </View>
  )
}

type ManualPDFProps = {
  company?: {
    name?: string
    logo?: string
  }
}

export function ManualPDFDocument({ company }: ManualPDFProps = {}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
            {company?.logo && (
              <Image src={company.logo} style={{ width: 40, height: 40, objectFit: "contain" }} />
            )}
            <View>
              <Text style={styles.headerTitle}>{company?.name || "App Serviço"}</Text>
              <Text style={styles.headerSub}>Sistema de Gestão de Oficina Mecânica</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Manual do Usuário</Text>
        <Text style={styles.subtitle}>Guia completo de funcionalidades do sistema</Text>

        <Text style={styles.chapterTitle}>1. Introdução</Text>
        <Text style={styles.text}>
          O App Serviço é um sistema web para gestão de oficinas mecânicas, desenvolvido com Next.js.
          Ele oferece controle completo de ordens de serviço, clientes, veículos, técnicos, produtos,
          estoque, financeiro e relatórios.
        </Text>
        <Text style={styles.text}>
          O sistema conta com autenticação por email/senha, quatro níveis de acesso, leitor de código
          de barras via câmera e exportação de relatórios em XLSX e PDF.
        </Text>

        <Text style={styles.chapterTitle}>2. Autenticação e Acesso</Text>
        <Text style={styles.text}>
          O acesso ao sistema é feito pela tela de login com email e senha. Usuários inativos
          não conseguem autenticar. Após o login, o usuário é redirecionado ao Dashboard.
        </Text>
        <Text style={styles.text}>
          A barra lateral (sidebar) exibe apenas os módulos que o usuário tem permissão para acessar,
          de acordo com seu perfil.
        </Text>

        <Text style={styles.chapterTitle}>3. Papéis e Permissões</Text>
        <Text style={styles.text}>O sistema possui quatro perfis de acesso:</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colRole}>Perfil</Text>
            <Text style={styles.colDesc}>Acesso</Text>
          </View>
          <RoleRow role="Administrador" desc="Acesso total a todos os módulos do sistema" />
          <RoleRow role="Gerente" desc="Clientes, Veículos, Técnicos, Produtos, Ordens de Serviço, Financeiro, Relatórios, Dashboard" />
          <RoleRow role="Atendente" desc="Clientes, Veículos, Ordens de Serviço (criar e visualizar), Consultas" />
          <RoleRow role="Técnico" desc="Ordens de Serviço (apenas as designadas, atualizar status)" />
        </View>

        <Text style={styles.chapterTitle}>4. Dashboard</Text>
        <Text style={styles.text}>
          O Dashboard exibe um resumo geral da oficina com cards de indicadores:
          serviços do dia, serviços abertos, em andamento, concluídos, faturamento
          (hoje, semana, mês) e total de clientes cadastrados.
        </Text>
        <Text style={styles.text}>
          Inclui alerta de estoque baixo quando produtos estão abaixo do mínimo,
          gráficos de serviços por status e faturamento, e tabela de produtividade
          dos técnicos.
        </Text>

        <Text style={styles.chapterTitle}>5. Clientes</Text>
        <Text style={styles.text}>
          O módulo de clientes permite cadastrar e gerenciar informações dos clientes
          da oficina. Cada cliente pode ter múltiplos veículos vinculados.
        </Text>
        <Text style={styles.sectionTitle}>Campos do Cadastro</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colField}>Campo</Text>
            <Text style={styles.colType}>Tipo</Text>
            <Text style={styles.colReq}>Obrig.</Text>
            <Text style={styles.colNotes}>Observação</Text>
          </View>
          <FieldRow field="Nome Completo" type="text" req="Sim" notes="Nome do cliente" />
          <FieldRow field="CPF" type="text" req="Não" notes="11 dígitos, validado" />
          <FieldRow field="Telefone" type="text" req="Não" notes="Formato internacional +55" />
          <FieldRow field="WhatsApp" type="text" req="Não" notes="Contato do cliente" />
          <FieldRow field="Email" type="email" req="Não" notes="Email do cliente" />
          <FieldRow field="Endereço" type="text" req="Não" notes="Rua, número, bairro, cidade, estado, CEP" />
        </View>
        <Text style={styles.text}>
          Na listagem de clientes é possível buscar por nome ou CPF. Cada linha mostra
          nome, contato, veículo e placa do primeiro veículo cadastrado.
        </Text>
      </Page>

      {/* Page 2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>App Serviço</Text>
            <Text style={styles.headerSub}>Manual do Usuário</Text>
          </View>
        </View>

        <Text style={styles.chapterTitle}>6. Veículos</Text>
        <Text style={styles.text}>
          O módulo de veículos gerencia a frota dos clientes. Cada veículo pertence a
          um cliente e pode ter ordens de serviço associadas.
        </Text>
        <Text style={styles.sectionTitle}>Campos do Cadastro</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colField}>Campo</Text>
            <Text style={styles.colType}>Tipo</Text>
            <Text style={styles.colReq}>Obrig.</Text>
            <Text style={styles.colNotes}>Observação</Text>
          </View>
          <FieldRow field="Placa" type="text" req="Sim" notes="Auto maiúsculo, máx 7 caracteres" />
          <FieldRow field="Marca" type="combobox" req="Não" notes="Seleção de lista pré-definida" />
          <FieldRow field="Modelo" type="text" req="Sim" notes="Modelo do veículo" />
          <FieldRow field="Ano" type="number" req="Não" notes="Ano de fabricação" />
          <FieldRow field="Cor" type="text" req="Sim" notes="Cor predominante" />
          <FieldRow field="Quilometragem" type="number" req="Não" notes="KM atual" />
          <FieldRow field="Cliente" type="select" req="Sim" notes="Vínculo com cliente existente" />
        </View>

        <Text style={styles.chapterTitle}>7. Técnicos</Text>
        <Text style={styles.text}>
          Gerencia os profissionais que realizam os serviços na oficina.
        </Text>
        <Text style={styles.sectionTitle}>Campos do Cadastro</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colField}>Campo</Text>
            <Text style={styles.colType}>Tipo</Text>
            <Text style={styles.colReq}>Obrig.</Text>
            <Text style={styles.colNotes}>Observação</Text>
          </View>
          <FieldRow field="Nome" type="text" req="Sim" notes="Nome do técnico" />
          <FieldRow field="CPF" type="text" req="Sim" notes="11 dígitos, único, validado" />
          <FieldRow field="Cargo" type="text" req="Sim" notes="Ex: Mecânico, Eletricista" />
          <FieldRow field="Telefone" type="text" req="Não" notes="Contato do técnico" />
        </View>

        <Text style={styles.chapterTitle}>8. Produtos e Estoque</Text>
        <Text style={styles.text}>
          O módulo de produtos gerencia o inventário da oficina. Permite controlar
          entradas, saídas e ajustes de estoque, além de leitura de código de barras
          via câmera.
        </Text>
        <Text style={styles.sectionTitle}>Campos do Cadastro</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colField}>Campo</Text>
            <Text style={styles.colType}>Tipo</Text>
            <Text style={styles.colReq}>Obrig.</Text>
            <Text style={styles.colNotes}>Observação</Text>
          </View>
          <FieldRow field="Código" type="text" req="Sim" notes="Pode ser lido por código de barras" />
          <FieldRow field="Descrição" type="text" req="Sim" notes="Nome do produto" />
          <FieldRow field="Categoria" type="text" req="Não" notes="Classificação" />
          <FieldRow field="Unidade" type="text" req="Não" notes="UN, PC, KG, L (padrão: UN)" />
          <FieldRow field="Estoque Atual" type="number" req="Não" notes="Quantidade em estoque" />
          <FieldRow field="Estoque Mínimo" type="number" req="Não" notes="Alerta quando abaixo deste valor" />
          <FieldRow field="Valor Custo" type="number" req="Não" notes="Preço de custo" />
          <FieldRow field="Valor Venda" type="number" req="Não" notes="Preço de venda" />
        </View>

        <Text style={styles.sectionTitle}>Movimentações de Estoque</Text>
        <Text style={styles.text}>
          Tipos de movimentação: Entrada (compra, devolução), Saída (uso, venda),
          Ajuste (correção de inventário) e OS (automático ao concluir ordem de serviço).
        </Text>
        <Text style={styles.text}>
          O leitor de código de barras utiliza a câmera do dispositivo para escanear
          códigos de barras de produtos, agilizando o cadastro e a movimentação.
        </Text>
      </Page>

      {/* Page 3 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>App Serviço</Text>
            <Text style={styles.headerSub}>Manual do Usuário</Text>
          </View>
        </View>

        <Text style={styles.chapterTitle}>9. Ordens de Serviço</Text>
        <Text style={styles.text}>
          As Ordens de Serviço (OS) são o módulo central do sistema. Registram todo o
          fluxo de atendimento, desde a abertura até a conclusão.
        </Text>

        <Text style={styles.sectionTitle}>Abertura de OS</Text>
        <Text style={styles.text}>
          Para abrir uma nova OS, informe: nome do cliente, placa, modelo e cor do veículo,
          marca (combobox), técnico responsável, prioridade, descrição
          do problema e observações.
        </Text>
        <Text style={styles.text}>
          Se o veículo já existir no sistema, o cliente é vinculado automaticamente. Caso
          contrário, um novo cliente e veículo são criados.
        </Text>

        <Text style={styles.sectionTitle}>Detalhes da OS</Text>
        <Text style={styles.text}>
          A página de detalhes exibe: informações do cliente (nome, CPF, telefone,
          email), dados do veículo, técnico, datas de abertura e conclusão, prioridade,
          valores (mão de obra, materiais, total) e histórico de status.
        </Text>
        <Text style={styles.text}>
          É possível exportar a OS em PDF clicando no botão "PDF" no topo da página.
        </Text>

        <Text style={styles.sectionTitle}>Transições de Status</Text>
        <Text style={styles.text}>
          O status da OS segue um fluxo controlado. Cada transição só é permitida quando
          o status atual é compatível:
        </Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colStatus}>Status Atual</Text>
            <Text style={styles.colLabel}>Nome</Text>
            <Text style={styles.colColor}>Cor</Text>
            <Text style={styles.colTransition}>Pode Ir Para</Text>
          </View>
          <StatusRow status="Aberto" label="Aberto" color="Azul" transition="Em Andamento, Cancelado" />
          <StatusRow status="Em Andamento" label="Em Andamento" color="Amarelo" transition="Aguardando Peças, Concluído" />
          <StatusRow status="Aguardando Peças" label="Aguardando Peças" color="Laranja" transition="Em Andamento, Concluído" />
          <StatusRow status="Concluído" label="Concluído" color="Verde" transition="(nenhuma)" />
          <StatusRow status="Cancelado" label="Cancelado" color="Vermelho" transition="(nenhuma)" />
        </View>

        <Text style={styles.sectionTitle}>Conclusão da OS</Text>
        <Text style={styles.text}>
          Ao concluir uma OS, o técnico deve preencher: diagnóstico técnico, serviço executado,
          valor da mão de obra e produtos utilizados. O sistema automaticamente:
        </Text>
        <Text style={styles.bullet}>• Calcula o valor total (mão de obra + materiais)</Text>
        <Text style={styles.bullet}>• Dá baixa no estoque dos produtos utilizados</Text>
        <Text style={styles.bullet}>• Cria um lançamento financeiro de entrada</Text>
        <Text style={styles.bullet}>• Registra o histórico de status</Text>

        <Text style={styles.chapterTitle}>10. Financeiro</Text>
        <Text style={styles.text}>
          O módulo financeiro exibe um resumo das entradas e saídas do dia.
          As entradas são geradas automaticamente ao concluir uma OS. As saídas
          são registradas manualmente para despesas diversas.
        </Text>
        <Text style={styles.sectionTitle}>Campos de Saída</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colField}>Campo</Text>
            <Text style={styles.colType}>Tipo</Text>
            <Text style={styles.colReq}>Obrig.</Text>
            <Text style={styles.colNotes}>Observação</Text>
          </View>
          <FieldRow field="Descrição" type="text" req="Sim" notes="Motivo da saída" />
          <FieldRow field="Valor" type="number" req="Sim" notes="Valor positivo" />
          <FieldRow field="Data" type="date" req="Não" notes="Padrão: data atual" />
        </View>
      </Page>

      {/* Page 4 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>App Serviço</Text>
            <Text style={styles.headerSub}>Manual do Usuário</Text>
          </View>
        </View>

        <Text style={styles.chapterTitle}>11. Relatórios</Text>
        <Text style={styles.text}>
          O sistema oferece dois tipos de relatórios:
        </Text>
        <Text style={styles.sectionTitle}>Relatório Gerencial</Text>
        <Text style={styles.text}>
          Acessível pelo menu "Relatórios", permite filtrar por período e status.
          Exibe indicadores (total de OS, concluídas, receita total, tempo médio),
          gráfico de serviços por status e tabela com as últimas ordens.
          É possível exportar em XLSX e PDF.
        </Text>
        <Text style={styles.sectionTitle}>Relatório de Ordens de Serviço</Text>
        <Text style={styles.text}>
          Acessível dentro de "Ordens de Serviço &gt; Relatórios", permite exportar
          a lista de OS filtrada por período e status nos formatos XLSX e PDF.
        </Text>

        <Text style={styles.chapterTitle}>12. Usuários</Text>
        <Text style={styles.text}>
          Módulo exclusivo para administradores. Permite gerenciar os usuários
          que acessam o sistema, definindo nome, email, senha e perfil de acesso.
        </Text>
        <Text style={styles.sectionTitle}>Campos do Cadastro</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colField}>Campo</Text>
            <Text style={styles.colType}>Tipo</Text>
            <Text style={styles.colReq}>Obrig.</Text>
            <Text style={styles.colNotes}>Observação</Text>
          </View>
          <FieldRow field="Nome" type="text" req="Sim" notes="Nome completo" />
          <FieldRow field="Email" type="email" req="Sim" notes="Usado para login" />
          <FieldRow field="Senha" type="password" req="Sim" notes="Mínimo 6 caracteres" />
          <FieldRow field="Perfil" type="select" req="Sim" notes="ADMIN, MANAGER, ATTENDANT, TECHNICIAN" />
        </View>

        <Text style={styles.chapterTitle}>13. Configurações</Text>
        <Text style={styles.text}>
          Módulo exclusivo para administradores. Permite configurar os dados da
          empresa que aparecem nos relatórios e PDFs: nome, logo, CNPJ, telefone,
          email e endereço completo.
        </Text>

        <Text style={styles.chapterTitle}>14. Exportações Disponíveis</Text>
        <Text style={styles.sectionTitle}>Relatórios em XLSX</Text>
        <Text style={styles.text}>
          Os relatórios podem ser exportados em formato XLSX (Excel) para análise
          dos dados em planilhas. Disponível nos módulos de Produtos e Relatórios.
        </Text>
        <Text style={styles.sectionTitle}>Relatórios em PDF</Text>
        <Text style={styles.text}>
          PDFs individuais de ordens de serviço podem ser gerados pelo botão "PDF"
          na página de detalhes da OS. Relatórios completos também podem ser
          exportados em PDF pelo módulo de relatórios.
        </Text>

        <View style={styles.footer}>
          <Text>App Serviço - Sistema de Gestão de Oficina</Text>
          <Text>Manual do Usuário v1.0</Text>
        </View>
      </Page>
    </Document>
  )
}
