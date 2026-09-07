# Ticket 20: Alerta Visual Piscante no Mapa de Mesas e Aviso Sonoro no App do Garçom

Status: ready-for-agent

## Descrição
Implementar no aplicativo móvel do garçom (`apps/mobile`) o componente do *Mapa de Mesas* com suporte a alertas visuais piscantes em amarelo para mesas com `Chamado de Mesa` ativo, acompanhado por sinal sonoro/notificação push.

## Tarefas
- [ ] Criar/Atualizar o componente `MapaMesas.ts` em `apps/mobile/src/components` com a grade visual das mesas por status (🟢 Livre, 🔴 Em Atendimento, 🟡 Aguardando Atendimento/Fechamento).
- [ ] Adicionar animação piscante (amarelo/alerta) para mesas que emitirem o evento `table:call`.
- [ ] Integrar efeito sonoro/notificação no app ao receber chamados de mesa em tempo real.
- [ ] Adicionar botão para o garçom atender/limpar o chamado da mesa.
- [ ] Adicionar testes unitários para a renderização do mapa de mesas e recebimento dos eventos.
