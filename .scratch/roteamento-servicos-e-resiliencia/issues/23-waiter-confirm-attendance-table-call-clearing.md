# Ticket 23: Botão de Confirmação de Atendimento ao Chamado da Mesa no App do Garçom

Status: ready-for-agent

## Descrição
Implementar o botão "✅ Confirmar Atendimento" na tela `ComandaDetalhesEtapas` (`apps/mobile`), permitindo ao garçom limpar o chamado ativo de uma mesa ao acessá-la, desligando a animação piscante amarela no *Mapa de Mesas* e o aviso sonoro.

## Tarefas
- [ ] Adicionar o botão "✅ Confirmar Atendimento" no topo do componente `ComandaDetalhesEtapas.ts`.
- [ ] Integrar a chamada para `limparChamadoMesa(mesaId)`.
- [ ] Atualizar o status da mesa no *Mapa de Mesas* removendo o indicador piscante amarelo (`alertaPiscante: false`).
- [ ] Silenciar alertas sonoros ativos para a mesa atendida.
- [ ] Adicionar testes unitários para a ação de confirmação de atendimento.
