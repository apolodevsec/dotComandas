Status: resolved

# Especificação: Arquitetura de Roteamento de Serviços, QR Code Estático e Resiliência

## Problem Statement

Restaurantes e bares necessitam de rotas web previsíveis para clientes, cozinheiros e caixas no mesmo domínio principal, além de adesivos de QR Code estáticos nas mesas que não precisem ser trocados diariamente. Ademais, oscilações na conexão Wi-Fi do salão ou cozinha podem causar perda ou duplicidade de pedidos caso as telas continuem aceitando interações enquanto desconectadas.

## Solution

A **Arquitetura de Roteamento de Serviços e Resiliência** centraliza todas as aplicações web no domínio único (`https://dotcomandas.com`) com prefixos de rotas (`/m/:mesaId` para PWA do Cliente, `/kds` para Cozinha em Rota Única Global e `/caixa` para o Operador de Caixa). Permite o uso de QR Codes estáticos com tokens assinados permanentes validados contra o estado da Comanda no Astra DB, implementa um overlay de bloqueio em tela cheia na perda de conexão WebSocket/HTTP e adiciona o botão "Confirmar Atendimento" na tela de detalhes da comanda no app do garçom.

## User Stories

1. As a Cliente, I want to scan a permanent QR Code sticker on my Mesa, so that I am instantly directed to `https://dotcomandas.com/m/:mesaId?token=:jwtTokenHash` without needing new QR Codes printed each day.
2. As a Cliente, I want the system to check if my Mesa's Comanda is active in Astra DB, so that I am shown a clear message if the table session has been closed.
3. As a Cliente, I want to see a full-screen disconnection overlay when my phone loses internet connection, so that I do not attempt to submit orders while offline.
4. As a Cozinheiro, I want to access the global KDS screen at `https://dotcomandas.com/kds`, so that all kitchen orders appear in a single unified real-time display.
5. As a Cozinheiro, I want the KDS screen to display a full-screen disconnection overlay during network drops, so that preparation statuses are never lost or desynchronized.
6. As an Operador de Caixa, I want to access the cashier checkout panel at `https://dotcomandas.com/caixa`, so that I can close comandas and record payments.
7. As a Garçom, I want tapping a flashing table (🟡) on my Mapa de Mesas to open `ComandaDetalhesEtapas` with a prominent "✅ Confirmar Atendimento" button, so that I can clear the table alert and silence audio notifications.

## Implementation Decisions

- **Domain Alignment**: Strictly align with vocabulary in `CONTEXT.md` and [ADR 0013](file:///d:/Projects/dotComandas/docs/adr/0013-arquitetura-de-roteamento-tokens-qr-code-e-resiliencia.md).
- **Single-Domain Web Routing (`apps/web`)**: Next.js App Router routing setup exposing `/m/[mesaId]`, `/kds`, and `/caixa` on the unified host.
- **Static QR Code Security Model**: Permanent signed JWT table tokens validated against Astra DB active comanda status (`Aberta` vs `Fechada`).
- **Connection Resilience Overlay (`apps/web` & `apps/mobile`)**: Full-screen modal overlay triggered on WebSocket `disconnect` or offline HTTP network events, blocking UI interaction until reconnection.
- **Table Call Clearing Flow (`apps/mobile`)**: Header button in `ComandaDetalhesEtapas` invoking `limparChamadoMesa(mesaId)` to turn off yellow flashing and audio alerts on `MapaDeMesas`.

## Testing Decisions

- **Test Seam 1 (Route & Static Token Seam - `apps/web` & `apps/api`)**: Integration tests validating QR Code static token verification against Astra DB comanda status.
- **Test Seam 2 (Resilience Seam - `apps/web` & `apps/mobile`)**: Component and hook tests verifying that WebSocket disconnect events trigger the full-screen disconnection overlay.
- **Test Seam 3 (Table Call Clearing Seam - `apps/mobile`)**: Unit tests for `ComandaDetalhesEtapas` ensuring table attendance confirmation clears table call alerts.

## Out of Scope

- Subdomain separation for web apps (all apps run on unified path prefixes under single domain).
- Offline local database replication (offline state triggers full-screen blocking overlay).

## Further Notes

- Recorded in [ADR 0013](file:///d:/Projects/dotComandas/docs/adr/0013-arquitetura-de-roteamento-tokens-qr-code-e-resiliencia.md).
