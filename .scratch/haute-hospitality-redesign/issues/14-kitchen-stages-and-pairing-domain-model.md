# Ticket 14: Modelagem de Etapas de Cozinha e Harmonização nos Pedidos

Status: resolved

## Descrição
Atualizar o modelo de dados de `Pedido` em `@dotcomandas/shared` e no Astra DB para permitir o envio cadenciado de pratos em etapas (`Entrada`, `Prato Principal`, `Sobremesa`) com `statusDisparo`.

## Tarefas
- [ ] Atualizar tipos `Pedido` e `EtapaPedido` em `@dotcomandas/shared`.
- [ ] Adicionar suporte a status de disparo (`Aguardando Disparo` | `Liberado`).
- [ ] Adicionar suporte ao campo `harmonizacao` nos itens de cardápio.
- [ ] Adicionar testes unitários para a máquina de transição de status das etapas.
