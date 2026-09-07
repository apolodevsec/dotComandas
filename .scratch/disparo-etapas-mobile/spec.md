# Spec: Interface de Disparo por Etapas no App do Garçom (Mobile)

Status: resolved

## Problem Statement

Restaurantes de alta gastronomia que atendem com cardápios degustação e pratos sequenciados precisam controlar rigorosamente o momento em que cada etapa (*Etapa de Cozinha*) entra em preparo. Sem uma interface dedicada no aplicativo do garçom com trava de segurança, pratos principais correm o risco de serem enviados antecipadamente enquanto os clientes ainda estão consumindo as entradas.

## Solution

1. **Interface de Comanda por Etapas no App do Garçom (`apps/mobile`)**: Exibir os itens da comanda em uma lista plana ordenada por horário de inserção com etiquetas indicando a etapa (ex.: `[Entrada]`, `[Prato Principal]`).
2. **Autenticação RBAC via PIN de Funcionário**: Exigir a validação do `PIN de Funcionário` (6 dígitos) de um garçom ou administrador para autorizar o disparo de qualquer etapa.
3. **Bloqueio Sequencial Estrito no Backend (`apps/api`)**: A API consulta o Astra DB ao receber a solicitação de disparo da etapa $N$ e rejeita a requisição com HTTP 400 (`ETAPA_ANTERIOR_PENDENTE`) caso qualquer item da etapa $N-1$ não esteja marcado como `Pronto` ou `Entregue`.
4. **Notificação Realtime via WebSocket (`ETAPA_CONCLUIDA`)**: Quando a cozinha conclui o último prato de uma etapa no KDS, o backend emite um evento WebSocket que habilita instantaneamente o botão de disparo da etapa seguinte no aplicativo móvel do garçom.

## User Stories

1. As a waiter, I want to view my table's comanda items listed in chronological order with stage tags (e.g. `[Entrada]`, `[Prato Principal]`), so that I clearly know which dishes belong to which course.
2. As a waiter, I want to tap "🚀 Disparar Próxima Etapa" and authenticate with my 6-digit PIN, so that only authorized staff can release kitchen orders.
3. As a waiter, I want the next stage release button to unlock automatically in real-time when the kitchen finishes the last dish of the current stage, so that I don't need to manually refresh the app.
4. As a restaurant manager, I want the backend to strictly reject stage releases if the previous stage has pending items, so that kitchens never receive premature main courses.
5. As a kitchen chef, I want stage releases triggered by waiters to immediately appear on the KDS in the "Pendente" column, so that preparation begins without delay.

## Implementation Decisions

- **Domain Glossary Alignment**: Conforme [CONTEXT.md](file:///d:/Projects/dotComandas/CONTEXT.md) e [ADR 0011](file:///d:/Projects/dotComandas/docs/adr/0011-disparo-sequencial-estrito-de-etapas.md).
- **Mobile Component (`apps/mobile`)**: Construção do componente `ComandaDetalhesEtapas` no React Native utilizando os tokens de design do `@dotcomandas/ui`.
- **API Endpoint (`apps/api`)**:
  - `POST /api/comandas/:id/etapas/:ordem/disparar`
  - Requer `pinFuncionarios` no header/body.
  - Valida no Astra DB se a etapa `ordem - 1` possui todos os itens com `estado === 'Pronto' || estado === 'Entregue'`.
- **Realtime Event**: Emissão do evento WebSocket `ETAPA_CONCLUIDA` com payload `{ comandaId: string, mesaId: string, etapaConcluida: number }`.

## Testing Decisions

- **Test Seam 1 (`apps/mobile`)**: Testes unitários para o fluxo do componente `ComandaDetalhesEtapas` (renderização de tags e habilitação condicional do botão de disparo).
- **Test Seam 2 (`apps/api`)**: Testes de integração na API verificando o bloqueio estrito sequencial (HTTP 400 se a etapa anterior estiver pendente vs HTTP 200 se a etapa anterior estiver concluída).
- **Test Seam 3 (`packages/shared`)**: Testes da máquina de estado validando as transições de `statusDisparo` (`Aguardando Disparo` -> `Liberado`).

## Out of Scope

- Disparo automático de etapas por timer de tolerância (o disparo é estritamente manual por decisão do garçom).
- Alteração no fluxo de pagamento ou fechamento da comanda pelo caixa.

## Further Notes

- Especificações registradas na [ADR 0011](file:///d:/Projects/dotComandas/docs/adr/0011-disparo-sequencial-estrito-de-etapas.md).
