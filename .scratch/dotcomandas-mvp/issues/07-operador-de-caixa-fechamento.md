# 07: Operador de Caixa Fechamento & Manual Payment Processing

**What to build:** Build the Operador de Caixa web dashboard for reviewing consumed Pedidos of a Comanda, applying discounts/fees, registering manual payments (Dinheiro, Crédito, Débito, Pix), and marking the Comanda as Fechada.

**Blocked by:** 06: Real-time Order Status Notifications

**Status:** resolved

- [x] Implement Comanda summary endpoint calculating item totals, adicionais, and discounts
- [x] Build Caixa web dashboard with Mesa/Comanda lookup and payment modal
- [x] Transition Comanda state to Fechada and broadcast Mesa release event
