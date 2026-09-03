Status: ready-for-agent

# Especificação: dotComandas MVP

## Problem Statement

Restaurantes e bares enfrentam lentidão no atendimento presencial, erros no repasse manual de pedidos para a cozinha, falta de visibilidade do status de preparo dos pratos e demora no fechamento de contas pelo caixa.

## Solution

O **dotComandas** oferece uma plataforma integrada e em tempo real com autoatendimento para clientes via QR Code na mesa (sem cadastro prévio), aplicativo móvel para garçons com autenticação rápida por PIN de 6 dígitos, painel de cozinha (KDS) em tempo real e painel de caixa para fechamento de comanda com múltiplos meios de pagamento.

## User Stories

1. As a Cliente, I want to scan a QR Code on my Mesa, so that I can immediately view the menu and start a Sessão de Mesa without creating an account.
2. As a Cliente, I want to select Items do Cardápio with custom options (such as meat doneness, extra toppings, or free text notes), so that I can customize my order according to my preferences.
3. As a Cliente, I want to submit my Pedido from my phone, so that it is sent directly to the kitchen queue.
4. As a Cliente, I want to view my current Comanda consumption total and list of Pedidos on my phone, so that I know how much I have spent so far.
5. As a Garçom, I want to log in using my PIN de Funcionário (6 digits), so that I can quickly authenticate on shared devices.
6. As a Garçom, I want to open or view any Mesa and launch Pedidos on behalf of the customer, so that I can serve customers who prefer traditional waiter service.
7. As a Garçom, I want to see the real-time Estado do Pedido of items assigned to my Mesas, so that I know when food/drinks are ready to be served.
8. As a Cozinheiro (KDS Operator), I want to view all Pendente Pedidos in real time on the KDS screen, so that I know what to prepare next.
9. As a Cozinheiro, I want to transition the Estado do Pedido from Pendente to Em Preparo and then to Pronto, so that waiters and customers are updated instantly.
10. As an Operador de Caixa, I want to search for a Mesa or Comanda number, so that I can review all consumed Pedidos before Fechamento.
11. As an Operador de Caixa, I want to apply discounts or additional fees to a Comanda, so that the final balance is accurate.
12. As an Operador de Caixa, I want to select the Forma de Pagamento (Dinheiro, Cartão de Crédito, Cartão de Débito, or Pix) and register the payment, so that the Comanda is marked as Fechada and the Mesa is freed.
13. As an Administrador, I want to manage Items do Cardápio, categories, and Grupos de Adicionais, so that the menu stays up to date.
14. As an Administrador, I want to create and manage Funcionários and assign their Papéis (RBAC) and 6-digit PINs, so that staff members have appropriate access levels.

## Implementation Decisions

- **Monorepo Architecture**: Organized with `pnpm workspaces` containing `apps/web` (Next.js for KDS, Caixa, Admin), `apps/mobile` (React Native Expo for Garçom/Cliente), `apps/api` (Node.js REST & WebSockets), and `packages/shared` (TypeScript types, state machine contracts, validation schemas).
- **Client Access & Authentication**: Anonymous QR Code table scanning generates a JWT-based `Sessão de Mesa` tied to the specific Mesa ID. Staff members authenticate using a user identifier and a 6-digit `PIN de Funcionário` evaluated against RBAC rules (`Admin`, `Garçom`, `Cozinha`, `Caixa`).
- **State Machine Contracts**:
  - `Comanda`: `Aberta` -> `Em Atendimento` -> `Aguardando Fechamento` -> `Fechada` (or `Cancelada`).
  - `Pedido`: `Pendente` -> `Em Preparo` -> `Pronto` -> `Entregue` (or `Cancelado`).
- **Menu Customization Model**: Item schema supports `Grupo de Adicionais` with single-choice options (e.g. meat doneness), multiple-choice options with incremental price additions (e.g. extra cheese +$3.00), and free-text notes.
- **Real-time Event Dispatching**: API emits WebSocket events (`order:created`, `order:status_changed`, `comanda:updated`) to subscribed KDS screens, waiter apps, and active table sessions.
- **Payment Architecture**: Modular strategy pattern for payments supporting manual registration of Dinheiro, Cartão de Crédito, Cartão de Débito, and Pix in the MVP, prepared for future automated Pix gateway integrations.

## Testing Decisions

- **Testing Seam**: Primary testing seam is at the HTTP & WebSocket API layer (`apps/api`). Integration tests will simulate full lifecycle workflows from `Sessão de Mesa` creation, placing `Pedidos`, status transitions on `KDS`, through to `Fechamento` on `Caixa`.
- **Behavioral Focus**: Tests will focus strictly on state transitions, validation of RBAC permissions, calculation of totals with adicionais and discounts, and WebSocket payload broadcasting without coupling to UI components.

## Out of Scope

- Automated Pix payment gateway integration (Mercado Pago, EFI) in the initial MVP release (manual registration only).
- Offline-first local database replication (PWA offline sync).
- Fiscal invoice generation (NFC-e / SAT).
- Table reservation system.

## Further Notes

- All code identifiers and data schemas will strictly use the domain vocabulary established in `CONTEXT.md`.
