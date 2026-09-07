# Ticket 19: Endpoint de Chamado de Mesa e Emissão de Eventos WebSocket no Backend

Status: resolved

## Descrição
Implementar o endpoint de API (`apps/api`) para recebimento de solicitações de atendimento do cliente ("Chamar Garçom"), emissão do evento WebSocket `table:call` e transmissão de notificações de status em tempo real para os garçons e o KDS.

## Tarefas
- [x] Criar o endpoint `POST /api/mesas/:id/chamado` em `apps/api/src/routes` e `index.ts`.
- [x] Validar o payload do chamado de mesa (`tipo: 'atendimento' | 'fechamento'`).
- [x] Criar o `chamado-service.ts` atualizando o estado da Mesa para `Aguardando Atendimento` ou `Aguardando Fechamento`.
- [x] Transmitir o evento WebSocket `table:call` para todos os aplicativos de garçons conectados.
- [x] Adicionar testes de integração verificando a persistência no Astra DB e emissão dos eventos.

