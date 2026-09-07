# Ticket 22: Overlay Rígido de Bloqueio em Tela Cheia por Desconexão de Rede

Status: resolved

## Descrição
Implementar o componente de overlay rígido em tela cheia para o KDS (`apps/web`) e o PWA do Cliente (`apps/mobile` / `apps/web`), ativado automaticamente quando houver perda de conexão WebSocket ou oscilação de rede HTTP, bloqueando a interface até a reconexão.

## Tarefas
- [x] Criar o componente `OverlayDesconexao.ts` em `packages/ui` com mensagem de bloqueio e status de reconexão.
- [x] Suportar estados de conexão `conectado`, `desconectado` e `reconectando`.
- [x] Configurar bloqueio visual rígido de interações na tela enquanto desconectado (`bloquearInteracao: true`).
- [x] Ocultar o overlay e liberar a interface automaticamente ao restabelecer a conexão.
- [x] Adicionar testes unitários para a ativação e desativação do overlay de desconexão (`overlay-desconexao.test.ts`).

