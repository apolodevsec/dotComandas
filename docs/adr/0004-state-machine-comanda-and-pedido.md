# Máquina de Estados para Comanda e Pedido

Definimos formalmente as transições de estado para garantir consistência operacional:
- **Comanda**: `Aberta` ➔ `Em Atendimento` ➔ `Aguardando Fechamento` ➔ `Fechada` (ou `Cancelada`).
- **Pedido**: `Pendente` ➔ `Em Preparo` ➔ `Pronto` ➔ `Entregue` (ou `Cancelado`).

Essa máquina de estados orienta a renderização das telas do KDS (Cozinha), o lançamento de novos itens pelo Garçom/Cliente e o bloqueio de novos pedidos durante a fase de fechamento no Caixa.
