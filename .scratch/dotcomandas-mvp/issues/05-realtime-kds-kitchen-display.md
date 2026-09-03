# 05: Real-time KDS (Kitchen Display System)

**What to build:** Build the Web KDS screen displaying incoming Pendente Pedidos in real time via WebSockets and enabling kitchen staff to transition status to Em Preparo and Pronto.

**Blocked by:** 04: Pedido Submission & Customizations

**Status:** resolved

- [x] Implement WebSocket server event broadcasting for new and updated Pedidos
- [x] Build KDS web interface with columns/cards for Pendente, Em Preparo, and Pronto
- [x] Implement one-click status transition buttons updating the backend and emitting events
