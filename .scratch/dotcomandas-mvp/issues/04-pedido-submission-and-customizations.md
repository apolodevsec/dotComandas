# 04: Pedido Submission & Customizations

**What to build:** Enable Clientes (via Sessão de Mesa) and Garçons (via PIN) to select Items do Cardápio, configure Grupos de Adicionais (single choice, paid additions, free text notes), and submit Pedidos in Pendente status.

**Blocked by:** 02: Mesa QR Code & Anonymous Session, 03: Staff Authentication & 6-Digit PIN RBAC

**Status:** resolved

- [x] Implement Pedido creation API endpoint with item customization validation
- [x] Build item customization modal/screen with single choice, paid additions, and notes
- [x] Calculate total price with adicionais dynamically before submission
