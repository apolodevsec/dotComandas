# Ticket 18: Interface do Cardápio do Cliente (PWA) e Modal Bottom Sheet de Customização

Status: resolved

## Descrição
Desenvolver a interface web móvel (PWA) do cliente em React Native Web (`apps/mobile`) contendo a navegação por abas de categorias tradicionais (*Entradas*, *Pratos*, *Bebidas*, *Sobremesas*), o modal *Bottom Sheet* para seleção de adicionais/observações e o Toast flutuante de progresso do pedido em tempo real.

## Tarefas
- [x] Criar o componente `CardapioCliente.ts` em `apps/mobile/src/components`.
- [x] Implementar abas de categorias com rolagem suave e seleção de itens.
- [x] Criar o componente `BottomSheetCustomizacao` com validação de opções obrigatórias, adicionais com cálculo de preço incremental e campo de texto para observações.
- [x] Implementar o Toast flutuante de notificação animada para alterações no `Estado do Pedido` via WebSocket.
- [x] Adicionar testes unitários para a interface do cliente e cálculo de preços customizados.

