# Ticket 17: Evento Realtime ETAPA_CONCLUIDA via WebSockets

Status: resolved

## Descrição
Implementar a emissão do evento WebSocket `ETAPA_CONCLUIDA` quando a cozinha finaliza o último prato de uma etapa no KDS, atualizando instantaneamente o aplicativo do garçom.

## Tarefas
- [ ] Emitir evento WebSocket `ETAPA_CONCLUIDA` quando o estado do último item da etapa transiciona para `Pronto`.
- [ ] Adicionar handler no app móvel do garçom para ouvir `ETAPA_CONCLUIDA` e habilitar o botão de disparo da etapa seguinte.
- [ ] Adicionar testes de integração para as notificações em tempo real.
