# App Serviço

Sistema web para gestão de oficinas mecânicas: cadastro de clientes, veículos, ordens de serviço, estoque, financeiro e indicadores operacionais.

## Stack

| Tecnologia | Versão | Finalidade |
|---|---|---|
| Next.js | 16 (App Router) | Framework fullstack |
| React | 19 | Interface |
| TypeScript | 5 | Tipagem |
| Prisma | 7 | ORM / Migrations |
| PostgreSQL | 15+ | Banco de dados |
| NextAuth | 4 | Autenticação (JWT + Credentials) |
| Tailwind CSS | 4 | Estilização |
| Zod | 4 | Validação de formulários |
| Chart.js + react-chartjs-2 | 4/5 | Gráficos do dashboard |
| Sheet.js (xlsx) | 0.18 | Exportação XLSX |
| react-toastify | 11 | Notificações |
| @react-pdf/renderer | 4 | Geração de PDF (estrutura pronta) |

## Requisitos

- Node.js 20+
- PostgreSQL 15+
- npm 10+

## Quick Start

```bash
# 1. Clone e instale dependências
npm install

# 2. Configure o banco de dados
copy .env.example .env
# Edite DATABASE_URL no .env com suas credenciais PostgreSQL

# 3. Execute as migrations
npx prisma migrate dev --name init

# 4. Popule o banco (cria admin e configurações padrão)
npx prisma db seed

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Credenciais Padrão

| Email | Senha | Perfil |
|---|---|---|
| admin@appservico.com | admin123 | Administrador |

> Altere a senha após o primeiro acesso e troque o secret `NEXTAUTH_SECRET` em produção.

## Estrutura do Projeto

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rotas autenticadas (com layout)
│   │   ├── clientes/             #   CRUD Clientes
│   │   ├── veiculos/             #   CRUD Veículos
│   │   ├── tecnicos/             #   CRUD Técnicos
│   │   ├── produtos/             #   CRUD Produtos + Movimentações
│   │   ├── ordens-servico/       #   OS + Relatórios
│   │   ├── financeiro/           #   Entradas/Saídas
│   │   ├── relatorios/           #   Relatórios gerenciais
│   │   └── configuracoes/        #   Dados da empresa
│   ├── api/                      # API Routes REST
│   │   ├── clientes/
│   │   ├── veiculos/
│   │   ├── tecnicos/
│   │   ├── produtos/
│   │   ├── ordens-servico/
│   │   ├── dashboard/
│   │   ├── financeiro/
│   │   ├── relatorios/
│   │   ├── estoque/
│   │   ├── whatsapp/
│   │   └── auth/
│   ├── login/                    # Página de login
│   └── layout.tsx                # Layout raiz
├── components/
│   ├── ui/                       # Componentes base (Button, Input, Table, Card, Modal, etc)
│   ├── layout/                   # Sidebar, Header, AuthGuard, AuthProvider
│   ├── dashboard/                # StatsCard, Charts
│   ├── clientes/                 # ClienteForm
│   ├── veiculos/                 # VeiculoForm
│   ├── tecnicos/                 # TecnicoForm
│   ├── produtos/                 # ProdutoForm
│   ├── ordens-servico/           # OSForm, StatusBadge
│   └── relatorios/               # ReportFilters
├── lib/
│   ├── prisma.ts                 # Singleton PrismaClient (com adapter PostgreSQL)
│   ├── auth.ts                   # Configuração NextAuth
│   ├── permissions.ts            # Guards de perfil de acesso
│   ├── validations/              # Schemas Zod (cliente, veiculo, etc)
│   ├── utils/                    # Helpers (CPF, placa, telefone, formatação)
│   └── services/                 # Camada de negócio (cliente, veiculo, OS, estoque, etc)
├── hooks/                        # Custom hooks
└── types/                        # Tipos compartilhados
```

## Funcionalidades

### Cadastros

- **Clientes** — Nome, CPF (validação + unicidade), telefone (+55), WhatsApp, email, endereço completo (campos individuais). Ativo/Inativo. Soft delete.
- **Veículos** — Placa (validação Mercosul/antigo), marca, modelo, cor, ano, quilometragem. Vinculado a um cliente. Histórico de troca de proprietário.
- **Técnicos** — Nome, CPF, cargo, telefone. Apenas Admin/Gerente cadastram. Ativo/Inativo.
- **Produtos** — Código único, descrição, categoria, unidade, estoque (min/max), valores de custo e venda. Movimentações com auditoria.

### Ordem de Serviço

- Abertura com cliente, veículo, técnico, descrição do problema e prioridade
- Numeraçao automática sequencial
- Fluxo de status restrito: Aberto → Em Andamento → Aguardando Peças → Concluído / Cancelado
- Conclusão obrigatória: diagnóstico, serviço executado, produtos utilizados, valor mão de obra
- Baixa automática de estoque ao concluir
- Cálculo automático: valor produtos + mão de obra = total
- Geração de entrada financeira automática
- Histórico completo de mudanças de status

### Dashboard

- Cards: serviços do dia, abertos, em andamento, concluídos
- Faturamento: diário, semanal, mensal
- Gráficos: serviços por status (Doughnut), faturamento (Bar)
- Alerta de produtos com estoque baixo
- Produtividade dos técnicos (serviços concluídos, valor produzido, tempo médio)
- Atualização automática a cada 5 minutos + botão manual

### Estoque

- Entrada, saída e ajuste manual
- Baixa automática via Ordem de Serviço
- Impede inclusão se estoque insuficiente
- Destaca produtos abaixo do mínimo no dashboard
- Histórico de movimentações com auditoria

### Financeiro

- Entradas geradas automaticamente de OS concluídas
- Saídas cadastradas manualmente (descrição, valor, data)
- Resumo: receita, despesas, saldo (diário/semanal/mensal)

### Relatórios

- Filtros por período, cliente, técnico, status
- Exportação XLSX com Sheet.js
- Estrutura pronta para PDF com @react-pdf/renderer (dados da empresa + gráficos)

### Controle de Acesso

| Perfil | Permissões |
|---|---|
| **Administrador** | Acesso total |
| **Gerente** | Clientes, Veículos, Produtos, OS, Relatórios |
| **Atendente** | Cadastrar clientes/veículos, abrir OS, consultar |
| **Técnico** | Visualizar serviços atribuídos, atualizar andamento |

### Auditoria

Toda operaçao (create, update, delete, status change, stock move, financial move) é registrada em `audit_logs` com: usuário, data/hora, operaçao, dados alterados (JSON).

## Regras de Negócio Implementadas

| RN | Descrição | Localização |
|---|---|---|
| RN001 | CPF duplicado, validação CPF, telefone +55, nome obrigatório, ativo/inativo | `lib/validations/cliente.ts`, `lib/services/cliente.ts` |
| RN002 | WhatsApp Evolution API — verificação + envio + histórico | `lib/services/whatsapp.ts` |
| RN003 | Placa única + validação, vinculo cliente, histórico proprietário | `lib/validations/veiculo.ts`, `lib/services/veiculo.ts` |
| RN004 | Apenas Admin/Gerente criam técnicos, inativos não vinculam | `app/api/tecnicos/route.ts` |
| RN005 | Código único, estoque min/max, estoque >= 0, inativos nao usam, auditoria | `lib/validations/produto.ts`, `lib/services/produto.ts` |
| RN006 | Movimentações registradas (data, usuario, qtd, motivo), baixa automática em OS, impede estoque insuficiente | `lib/services/produto.ts`, `lib/services/ordem-servico.ts` |
| RN007 | OS exige cliente + veículo + técnico + descrição, numeração automática, data/hora automática, status inicial "Aberto" | `lib/validations/ordem-servico.ts`, `lib/services/ordem-servico.ts` |
| RN008 | Fluxo restrito de status, impede retorno, registra usuário/data/hora | `lib/utils/constants.ts`, `lib/services/ordem-servico.ts` |
| RN009 | Conclusão exige diagnóstico, serviço, produtos, valor m.o.; cálculo automático; disponível para PDF | `lib/services/ordem-servico.ts` |
| RN010 | Entradas via OS concluídas, saídas manuais, dashboard com faturamento, cancelados não contam | `lib/services/financeiro.ts`, `lib/services/ordem-servico.ts` |
| RN011 | Dashboard com indicadores, atualização 5min automática + manual | `app/(auth)/page.tsx`, `lib/services/dashboard.ts` |
| RN012 | Produtividade por OS concluídas, valor produzido, tempo médio; filtros diário/semanal/mensal | `lib/services/dashboard.ts` |
| RN013 | Relatórios com filtros, exportação XLSX, estrutura PDF com logo + dados empresa + gráficos | `app/api/relatorios/`, `lib/services/relatorio.ts` |
| RN014 | 4 perfis com permissões granulares | `lib/permissions.ts`, `components/layout/Sidebar.tsx` |
| RN015 | Auditoria registra toda operação com usuário, data, dados alterados | `lib/services/audit.ts` |
| RN016 | Soft delete (active = false) em clientes, veículos, produtos, OS | Todos os services |
| RN017 | Senhas com bcrypt hash, sessão JWT, HTTPS, permissões por perfil | `lib/auth.ts`, `lib/permissions.ts` |

## Variáveis de Ambiente

```env
# Banco de dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/app-servico?schema=public"

# NextAuth
NEXTAUTH_SECRET="gerar-um-segredo-aleatorio-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Evolution API (WhatsApp) — opcional
EVOLUTION_API_URL="https://seu-server.evolution-api.com"
EVOLUTION_API_KEY="sua-api-key"
EVOLUTION_INSTANCE="nome-da-instancia"
```

## Scripts

```bash
npm run dev       # Desenvolvimento
npm run build     # Build de produção
npm run start     # Iniciar produção
npm run lint      # Verificar lint
npx prisma migrate dev   # Criar migrations
npx prisma db seed       # Popular banco
npx prisma studio        # Interface do banco
```

## Deploy

1. Configure `DATABASE_URL` e `NEXTAUTH_SECRET` no ambiente
2. Execute `npx prisma migrate deploy`
3. Execute `npx prisma db seed`
4. Build: `npm run build`
5. Start: `npm run start`

Utilize HTTPS obrigatoriamente em produção.

## Licença

Proprietária — todos os direitos reservados.
