# 🍷 dotComandas — Haute Hospitality & Boutique Dining System

> **dotComandas** é uma plataforma de gestão de atendimento, autoatendimento e comanda eletrônica projetada especificamente para **alta gastronomia**, **menus degustação** e **boutique hospitality**.

---

## 🌟 Visão Geral

O **dotComandas** combina um design elegante no estilo *luxo silencioso* (*Haute Hospitality*) com alta performance em tempo real, permitindo controle rigoroso de cadência de cozinha (*Disparo por Etapas*), atendimento ágil por garçons com autenticação via PIN de 6 dígitos, autoatendimento de clientes via QR Code sem cadastro prévio e gestão visual do KDS da cozinha.

---

## ✨ Principais Funcionalidades

- 📱 **Autoatendimento por QR Code (Sessão de Mesa)**
  - Leitura de QR Code na mesa pelo cliente com geração instantânea de token JWT sem necessidade de cadastro ou download de aplicativo.
  - Visualização do cardápio digital, acompanhamento de pedidos e consumo em tempo real.

- 🔑 **PIN Pad de 6 Digítos & RBAC**
  - Autenticação ultra-rápida em dispositivos compartilhados para a equipe (Garçom, Cozinha, Caixa, Admin).
  - Teclado numérico (*PIN Pad*) integrado para liberação de ações sensíveis em menos de 3 segundos.

- 🍽️ **Disparo Sequencial por Etapas (Menu Degustação)**
  - Organização de pedidos por etapas de cozinha (*Entradas*, *Pratos Principais*, *Sobremesas*, *Digestivos*).
  - Trava de segurança no backend (`ETAPA_ANTERIOR_PENDENTE`) que impede a liberação antecipada de etapas caso a anterior não esteja concluída.
  - Harmonização de bebidas recomendada por item do cardápio.

- 👨‍🍳 **KDS (Kitchen Display System) de Alto Contraste**
  - Painel em tempo real para a cozinha em Next.js com interface Dark Mode (`#131313` / `#2A2A2A`).
  - Alerta de Espera automático quando pratos excedem 15 minutos em preparo.
  - Alternador para **Modo de Alto Contraste Operacional** durante horários de pico.

- ⚡ **Sincronização em Tempo Real (WebSockets)**
  - Atualização instantânea bidirecional entre App do Garçom, KDS e Sessão de Mesa.
  - Emissão de evento WebSocket `ETAPA_CONCLUIDA` que habilita o disparo da próxima etapa automaticamente.

- 🗄️ **Persistência Atômica no DataStax Astra DB**
  - Armazenamento de comandas como documentos JSON aninhados (*Documento de Comanda*), garantindo leituras e gravações atômicas de alta velocidade.

- 💳 **Caixa & Fechamento Flexível**
  - Consolidação de consumo, aplicação de descontos ou taxas e suporte a múltiplas Formas de Pagamento (Dinheiro, Cartão de Crédito, Cartão de Débito, Pix).

---

## 🎨 Design System: Haute Hospitality

O ecossistema visual do **dotComandas** é fundamentado na especificação `Haute Hospitality` e centralizado no pacote `@dotcomandas/ui`:

- **Carvão Profundo**: `--surface: #131313`, `--surface-container: #2A2A2A`
- **Ouro-Areia Metálico**: `--primary: #C49A6C`
- **Bordas Refinadas**: `--border-gold-subtle: rgba(196, 154, 108, 0.3)`
- **Tipografia**: *Playfair Display* (títulos) + *Plus Jakarta Sans* (corpo/dados)
- **Geometria**: Cantos retos (0px border-radius) para sobriedade e sofisticação.

---

## 🏗️ Arquitetura Monorepo

O projeto é estruturado como um monorepo com `pnpm workspaces`:

```
dotComandas/
├── apps/
│   ├── api/        # Backend Node.js (REST, WebSockets & Astra DB Repository)
│   ├── web/        # Frontend Next.js (KDS Dark Mode, Caixa & Painel Admin)
│   └── mobile/     # App React Native Expo (App do Garçom com Mapa de Mesas & PIN)
├── packages/
│   ├── shared/     # Máquinas de estado (Comanda, Pedido), Schemas Zod & Tipos TypeScript
│   └── ui/         # Design System Haute Hospitality (tokens.ts, variables.css)
└── .scratch/       # Especificações de escopo e rastreamento de tickets
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** >= 18.x
- **pnpm** >= 8.x

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/apolodevsec/dotComandas.git
   cd dotComandas
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Configure as variáveis de ambiente:
   Copie `.env.example` para `.env` e configure as credenciais do Astra DB e segredos JWT:
   ```bash
   cp .env.example .env
   ```

4. Execute o ambiente de desenvolvimento:
   ```bash
   pnpm dev
   ```

---

## 🧪 Testes e Qualidade

O projeto utiliza **Vitest** com abordagem TDD (*Red-Green-Refactor*) em fatias verticais:

```bash
# Executar suíte completa de testes
pnpm test

# Checagem de tipos TypeScript em todo o monorepo
pnpm build
```

---

## 📖 Glossário de Domínio

Todos os identificadores e telas seguem o vocabulário unificado definido em `CONTEXT.md`:

- **Documento de Comanda**: JSON atômico persistido no Astra DB.
- **Mapa de Mesas**: Grade visual colorida (🟢 Livre, 🔴 Em Atendimento, 🟡 Aguardando Fechamento).
- **Etapa de Cozinha**: Sequenciamento ordenado de pratos no menu degustação.
- **Harmonização**: Recomendações técnicas de bebidas para itens do cardápio.
- **Alerta de Espera**: Destaque visual no KDS para pedidos em preparo há mais de 15 minutos.

---

## 📄 Licença

Este projeto é de uso privado e propriedade de **apolodevsec / dotComandas**.
