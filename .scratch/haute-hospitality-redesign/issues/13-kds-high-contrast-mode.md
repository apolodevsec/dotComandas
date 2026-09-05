# Ticket 13: Alternador de Modo de Alto Contraste Operacional no KDS

Status: ready-for-agent

## Descrição
Implementar no painel KDS (`apps/web`) um alternador de modo de alto contraste para destacar alertas visuais de urgência durante o atendimento em horários de pico.

## Tarefas
- [ ] Adicionar botão de toggle de alto contraste no cabeçalho do KDS.
- [ ] Definir estilos CSS de alto contraste para cartões de pedidos atrasados (`> 15 min`).
- [ ] Atualizar o teste unitário `KDSBoard.test.ts` para cobrir a alternância de contraste.
