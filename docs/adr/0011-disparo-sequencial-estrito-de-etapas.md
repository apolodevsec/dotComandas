# ADR 0011: Disparo Sequencial Estrito de Etapas de Cozinha no App do Garçom

## Status
Aceito

## Contexto
Em restaurantes de alta gastronomia que adotam o sequenciamento de pratos por etapas (*Etapa de Cozinha*), é essencial garantir a sincronia e cadência corretas entre o salão e a equipe de cozinha (KDS).

## Decisão
1. **Autenticação RBAC por PIN**: O disparo de qualquer etapa exige autenticação prévia via `PIN de Funcionário` (6 dígitos) com papel (`Role`) de `Garçom`, `Caixa` ou `Administrador`.
2. **Visualização Plana com Tags**: Os itens da comanda no app móvel do garçom serão exibidos em uma lista plana ordenada por horário de inserção, com uma etiqueta de texto ao lado do prato indicando a sua etapa (ex.: `[Entrada]`, `[Prato Principal]`).
3. **Bloqueio Sequencial Estrito**: O disparo de uma etapa posterior (ex.: 2ª etapa — Prato Principal) é bloqueado até que a etapa anterior (ex.: 1ª etapa — Entrada) seja formalmente concluída no KDS (`Pronto` / `Entregue`).
4. **Validação Rigorosa no Backend**: A API valida a condição no Astra DB antes de alterar o `statusDisparo` de uma etapa. Se a etapa $N-1$ possuir itens pendentes ou em preparo, a requisição é rejeitada com HTTP 400 (`ETAPA_ANTERIOR_PENDENTE`).
5. **Notificação Realtime via WebSocket**: A conclusão do último prato de uma etapa no KDS dispara um evento WebSocket `ETAPA_CONCLUIDA`, desbloqueando instantaneamente o botão de disparo da próxima etapa no aplicativo móvel do garçom.

## Consequências
- Evita que pratos de etapas posteriores sejam preparados prematuramente por disparo acidental ou solicitação indevida.
- Garante total sincronização em tempo real entre salão e cozinha sem necessidade de recarregamento manual.
