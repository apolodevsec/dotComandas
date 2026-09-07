# Ticket 19: Endpoint de Chamado de Mesa e Emissão de Eventos WebSocket no Backend

Status: ready-for-agent

## Descrição
Implementar o endpoint de API (`apps/api`) para recebimento de solicitações de atendimento do cliente ("Chamar Garçom"), emissão do evento WebSocket `table:call` e transmissão de notificações de status em tempo real para os garçons e o KDS.

## Tarefas
- [ ] Criar o endpoint `POST /api/comandas/:id/chamado` em `apps/api/src/routes`.
- [ ] Validar o payload do chamado de mesa (`tipo: 'atendimento' | 'fechamento'`).
- [ ] Atualizar o estado da Mesa e Comanda no Astra DB para `Aguardando Atendimento` ou `Aguardando Fechamento`.
- [ ] Transmitir o evento WebSocket `table:call` para todos os aplicativos de garçons conectados.
- [ ] Adicionar testes de integração verificando a persistência no Astra DB e emissão dos eventos.
