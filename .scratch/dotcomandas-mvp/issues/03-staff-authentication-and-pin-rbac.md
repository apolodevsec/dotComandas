# 03: Staff Authentication & 6-Digit PIN RBAC

**What to build:** Authenticate staff members (Garçom, Cozinha, Caixa, Admin) via user ID and 6-digit PIN, returning a JWT token containing their assigned Papel (Role).

**Blocked by:** 01: Monorepo Scaffold & Shared Types

**Status:** resolved

- [x] Implement staff PIN authentication endpoint in `apps/api`
- [x] Implement RBAC middleware checking user Papel (Garçom, Cozinha, Caixa, Admin)
- [x] Build login UI with PIN pad component for staff mobile & web clients
