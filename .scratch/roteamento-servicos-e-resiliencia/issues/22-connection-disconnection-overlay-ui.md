# Ticket 22: Overlay Rígido de Bloqueio em Tela Cheia por Desconexão de Rede

Status: ready-for-agent

## Descrição
Implementar o componente de overlay rígido em tela cheia para o KDS (`apps/web`) e o PWA do Cliente (`apps/mobile` / `apps/web`), ativado automaticamente quando houver perda de conexão WebSocket ou oscilação de rede HTTP, bloqueando a interface até a reconexão.

## Tarefas
- [ ] Criar o componente `OverlayDesconexao.tsx` com mensagem de bloqueio e status de reconexão.
- [ ] Monitorar o evento `disconnect` dos WebSockets e eventos `offline` da rede.
- [ ] Bloquear interações visuais na tela enquanto desconectado.
- [ ] Esconder o overlay e ressincronizar o estado automaticamente ao reconectar.
- [ ] Adicionar testes unitários para a ativação e desativação do overlay de desconexão.
