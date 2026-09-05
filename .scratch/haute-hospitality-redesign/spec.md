# Spec: Haute Hospitality Design System, Pacote @dotcomandas/ui & Etapas de Cozinha

Status: ready-for-agent

## Problem Statement

O dotComandas necessita evoluir visual e funcionalmente para atender estabelecimentos de alta gastronomia e boutique hospitality. A interface anterior possuía visual genérico azul/escuro, sem padronização de tokens de design compartilhados entre as aplicações web e mobile, e sem suporte ao sequenciamento cadenciado de pratos (*Etapas de Cozinha*) essencial em menús degustação.

## Solution

1. **Design System Haute Hospitality**: Implementar a especificação `design.md` em todo o ecossistema com suporte a luxo silencioso, carvão profundo (`#131313`/`#2A2A2A`), acentos em ouro-areia metálico (`#C49A6C`), tipografias `Playfair Display` + `Plus Jakarta Sans` e cantos retangulares `0px`.
2. **Pacote Compartilhado `@dotcomandas/ui`**: Centralizar os tokens em TypeScript/JSON (`tokens.ts`) e CSS variables (`variables.css`) em `packages/ui` para consumo unificado nas aplicações Web (Next.js) e Mobile (React Native).
3. **Modo de Alto Contraste Operacional no KDS**: Adicionar alternador visual no painel KDS da cozinha para aumentar a visibilidade de pedidos em atraso (`> 15 min`).
4. **Suporte a Etapas de Cozinha e Harmonização**: Atualizar a modelagem do `Pedido` para suportar disparos encadeados por etapas (`Entrada`, `Prato Principal`, `Sobremesa`) com status de liberação (`Aguardando Disparo` | `Liberado`), e permitir sugestões de harmonização de bebidas por item.

## User Stories

1. As a restaurant patron, I want to experience an elegant and refined interface, so that the digital order system aligns with the high gastronomy atmosphere.
2. As a kitchen chef, I want the KDS to display dish titles in clear typography with sharp rectilinear cards, so that I can quickly read orders without visual clutter.
3. As a kitchen chef, I want an operational high-contrast mode toggle on the KDS, so that overdue orders (> 15 min) stand out instantly during high-rush kitchen hours.
4. As a waiter, I want to place an order with defined kitchen stages (e.g. Entrada, Prato Principal, Sobremesa), so that dishes are prepared and served in the correct culinary cadence.
5. As a waiter, I want to trigger the release of the next kitchen stage (e.g., release Prato Principal when patrons finish Entradas), so that food arrives fresh without premature cooking.
6. As a waiter, I want to view wine and beverage pairing suggestions (Harmonização) linked to menu items, so that I can offer refined recommendations to patrons.
7. As a frontend developer, I want all design tokens (colors, typography, spacing) centralized in `@dotcomandas/ui`, so that I can reuse identical brand values across Next.js and React Native.
8. As a cashier, I want the cashier and checkout interface to share the Haute Hospitality visual theme, so that closing comanda payments feels cohesive with the patron's dining experience.

## Implementation Decisions

- **Design System Specs**: Baseado nas regras definidas em `design.md`, com paleta contendo `--surface: #131313`, `--surface-container: #2A2A2A`, `--primary: #C49A6C`, `--surface-light: #F7F7F7` e `--border-gold-subtle: rgba(196, 154, 108, 0.3)`.
- **Monorepo Architecture**: Criação do pacote `packages/ui` exportando `tokens.ts` (TypeScript agnóstico sem dependência de DOM) e `variables.css`.
- **Schema & Types Enchancement**: Atualização da interface `Pedido` em `@dotcomandas/shared` para incluir o array de etapas:
  ```ts
  export interface EtapaPedido {
    ordem: number;
    etapa: 'Entrada' | 'Prato Principal' | 'Sobremesa' | 'Digestivo' | string;
    statusDisparo: 'Aguardando Disparo' | 'Liberado';
    itens: ItemPedido[];
  }
  ```
- **KDS High-Contrast Toggle**: Implementação do estado `modoAltoContraste` no `KDSBoard.tsx` alternando classes CSS de destaque para os cartões de pedidos atrasados.
- **Domain Alignment**: Atualização das definições em `CONTEXT.md` (`Etapa de Cozinha` e `Harmonização`) e registro da `ADR 0010`.

## Testing Decisions

- **Test Seam 1 (`@dotcomandas/ui`)**: Testes unitários validando a integridade dos valores exportados em `tokens.ts` (hexadecimal de cores, famílias tipográficas, espaçamentos).
- **Test Seam 2 (`@dotcomandas/shared`)**: Testes de validação de schema e máquinas de estado para o ciclo de transição de `statusDisparo` das `Etapas de Cozinha` nos pedidos.
- **Test Seam 3 (`@dotcomandas/web`)**: Testes de componente no Vitest/Testing Library garantindo que o `KDSBoard` categoriza pedidos, aplica o tema Haute Hospitality e reage corretamente ao toggle de alto contraste.

## Out of Scope

- Redesenho de infraestrutura de banco de dados relacional (a persistência continua atômica no Astra DB DataStax em documentos JSON de comanda).
- Alterações nos contratos de autenticação via PIN de funcionário ou sessão anônima de QR Code.

## Further Notes

- A documentação de referência está salva no arquivo `design.md` na raiz do projeto e na `ADR 0010` em `docs/adr/0010-haute-hospitality-design-system-e-etapas.md`.
