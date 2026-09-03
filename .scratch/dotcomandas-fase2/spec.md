Status: ready-for-agent

# Especificação: dotComandas Fase 2 (KDS Web & App Garçom com Astra DB)

## Problem Statement

Cozinheiros precisam de um painel visual de alto contraste e fácil leitura à distância para controlar a fila de pedidos sem toque excessivo, enquanto garçons necessitam de um aplicativo móvel rápido com mapa de mesas colorido e login imediato por PIN para lançar pedidos sem fila ou papel.

## Solution

A Fase 2 do **dotComandas** implementa o painel KDS em Next.js (`apps/web`) com Dark Mode, cartões coloridos por estado e alertas visuais de tempo de espera (>15 min), o aplicativo mobile do Garçom em React Native (`apps/mobile`) com login via PIN Pad de 6 dígitos e Mapa de Mesas, e a persistência atômica dos documentos JSON no DataStax Astra DB.

## User Stories

1. As a Cozinheiro, I want to view all Pendente, Em Preparo, and Pronto Pedidos on a high-contrast Dark Mode KDS screen, so that I can easily see orders from across the kitchen.
2. As a Cozinheiro, I want to see a timer on each order card that flashes an Alerta de Espera if it exceeds 15 minutes, so that urgent orders are prioritized.
3. As a Cozinheiro, I want large single-tap action buttons to transition Pedidos from Pendente to Em Preparo and Pronto, so that I can update status quickly while cooking.
4. As a Garçom, I want to log in using a PIN Pad with my 6-digit PIN de Funcionário on my phone, so that I can authenticate in less than 3 seconds on shared devices.
5. As a Garçom, I want to view a visual Mapa de Mesas with color-coded status badges (🟢 Livre, 🔴 Em Atendimento, 🟡 Aguardando Fechamento), so that I can see table availability at a glance.
6. As a Garçom, I want to tap on any Mesa on the map to view its active Comanda and consumption history, so that I can answer customer questions immediately.
7. As a Garçom, I want to add new Pedidos with Item do Cardápio customizations (single choice and paid adicionais) directly from the table view, so that orders are sent instantly to the KDS.
8. As a Sistema, I want to store each Comanda and its Pedidos as a single nested JSON Document in Astra DB, so that reads and writes are atomic and fast.

## Implementation Decisions

- **Astra DB Document Storage**: Uses DataStax `@datastax/astra-db-ts` client (`db.collection('comandas')`) storing full nested Documento de Comanda structures containing metadata, pedidos array, and item adicionais.
- **KDS Web UI (`apps/web`)**: Next.js React component with CSS Vanilla Dark Mode, 3 flexbox/grid columns (`Pendente` yellow, `Em Preparo` blue, `Pronto` green), real-time WebSockets integration, and 15-minute timer alert triggers.
- **Mobile Waiter App (`apps/mobile`)**: React Native Expo app with custom PIN Pad 6-digit authentication screen, interactive Mapa de Mesas grid, and item customization modal.
- **State Machine Verification**: All status transitions enforced by `@dotcomandas/shared` state-machine validators before persistent save to Astra DB.

## Testing Decisions

- **Testing Seam**: HTTP/WebSocket API and Astra DB Document Repository layer (`apps/api/src/services`). Tests will verify document persistence in Astra DB (or fallback), state transitions, and real-time event broadcasting.
- **UI Seam**: Component rendering tests for KDS columns and PIN Pad input.

## Out of Scope

- Offline-first local SQLite sync.
- Table reservation calendar system.

## Further Notes

- Uses exact vocabulary from `CONTEXT.md` (`Documento de Comanda`, `Mapa de Mesas`, `Alerta de Espera`, `Teclado PIN`).
