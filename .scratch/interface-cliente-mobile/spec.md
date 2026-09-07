Status: resolved

# Especificação: Interface Mobile do Cliente (PWA) e Chamados no Mapa de Mesas

## Problem Statement

Clientes de restaurantes de alta gastronomia e boutique hospitality desejam realizar pedidos e visualizar o consumo em seus próprios celulares de forma rápida e sem atritos, sem ter que baixar aplicativos na loja ou preencher cadastros longos. Ao mesmo tempo, necessitam de acompanhamento em tempo real do preparo de seus pratos e de um meio ágil para solicitar suporte ou a conta ao garçom responsável pela mesa.

## Solution

A **Interface Mobile do Cliente (PWA)** oferece um aplicativo web responsivo em React Native Web acessado instantaneamente ao escanear o QR Code da mesa. O cliente navega pelo cardápio em categorias tradicionais, customiza itens via painel *Bottom Sheet* com adicionais e observações, envia pedidos diretamente para o KDS da cozinha, acompanha o status do preparo em tempo real via WebSockets com notificações flutuantes (*Toast*), e aciona o *Chamado de Mesa* para solicitar suporte ou o fechamento da conta presencial.

## User Stories

1. As a Cliente, I want to scan a QR Code on my Mesa, so that I can immediately access the digital menu and start an anonymous Sessão de Mesa without downloading an app or registering.
2. As a Cliente, I want to view Item do Cardápio items organized in traditional category tabs (Entradas, Pratos Principais, Bebidas, Sobremesas), so that I can quickly navigate through menu options.
3. As a Cliente, I want to tap on a menu item to open a Bottom Sheet modal, so that I can select mandatory options (e.g. meat doneness) and optional paid adicionais with price increments.
4. As a Cliente, I want to enter free-text notes in the Bottom Sheet (e.g. dietary restrictions or allergies), so that the kitchen receives specific preparation instructions.
5. As a Cliente, I want to submit my Pedido directly from my phone, so that it is instantly sent to the KDS kitchen queue and assigned to my Mesa's Comanda.
6. As a Cliente, I want to view a real-time progress timeline of my Pedidos (Pendente ⌛, Em Preparo 👨‍🍳, Pronto 🍽️), so that I know exactly when my food is being prepared.
7. As a Cliente, I want to receive floating Toast notifications on my screen when a Pedido changes status in the kitchen, so that I am alerted the moment my food is ready.
8. As a Cliente, I want to view the current total consumption and list of items on my Mesa's Comanda, so that I have full visibility of my bill.
9. As a Cliente, I want to tap a "Chamar Garçom" button to request assistance or physical payment at the table, so that the waiter responsible for my Mesa is notified immediately.
10. As a Garçom, I want table calls ("Chamar Garçom" for support or bill request) to flash the Mesa yellow (🟡 Aguardando Atendimento / Aguardando Fechamento) on my Mapa de Mesas, so that I can prioritize table service visually.
11. As a Garçom, I want to receive an audible sound alert and push notification on my smartphone when a Mesa under my care triggers a Chamado de Mesa, so that I never miss a customer request.

## Implementation Decisions

- **Domain Alignment**: Align strictly with vocabulary in `CONTEXT.md` (`Sessão de Mesa`, `Chamado de Mesa`, `Mapa de Mesas`, `Item do Cardápio`, `Grupo de Adicionais`, `KDS`) and [ADR 0012](file:///d:/Projects/dotComandas/docs/adr/0012-interface-mobile-do-cliente-pwa-e-chamados.md).
- **Client App Architecture (`apps/mobile`)**: React Native Web PWA component bundle exposing client table view routes (`/mesa/:id`) with JWT anonymous session storage.
- **Menu & Customizations UI**: Category tabs with smooth scrolling and `BottomSheetCustomizacao` modal supporting single-choice required options, multiple-choice paid adicionais, and free-text notes.
- **Anonymous Table Session Model**: All orders submitted via the PWA are attached to the single active `Comanda` of the Mesa ID stored in Astra DB without requiring individual user accounts or names.
- **Real-time Event Architecture (`apps/api`)**:
  - `table:call` WebSocket event emitted when customer taps "Chamar Garçom" with payload `{ mesaId: string, tipo: 'atendimento' | 'fechamento' }`.
  - API broadcasts `table:call` to connected waiter mobile apps to trigger yellow flashing state on `MapaDeMesas` and push/audio notifications.
  - API broadcasts `order:status_changed` WebSocket events to client PWA sessions to render floating Toast alerts.

## Testing Decisions

- **Test Seam 1 (Shared Schema & Domain Validation - `@dotcomandas/shared`)**: Unit tests for Zod schemas validating `ChamadoDeMesa` payloads, `SessãoDeMesa` token creation, and item customization validation.
- **Test Seam 2 (HTTP & WebSocket API Seam - `apps/api`)**: Integration tests simulating client PWA order submission, WebSocket `table:call` dispatching, and verifying that Astra DB updates `Mesa` status to `Aguardando Atendimento` or `Aguardando Fechamento`.
- **Test Seam 3 (Client PWA Component Seam - `apps/mobile`)**: Unit and component tests for `CardapioCliente`, `BottomSheetCustomizacao`, and `StatusTimelineCliente` ensuring correct rendering of categories, price increment calculations, and floating toasts.

## Out of Scope

- Digital in-app online payment integration (credit card gateway / Pix QR Code) in this phase (payments remain physical at table via waiter or cashier).
- Individual sub-comandas per customer on a shared table (all orders belong to the single Mesa Comanda).

## Further Notes

- Full architectural context and trade-offs recorded in [ADR 0012](file:///d:/Projects/dotComandas/docs/adr/0012-interface-mobile-do-cliente-pwa-e-chamados.md).
