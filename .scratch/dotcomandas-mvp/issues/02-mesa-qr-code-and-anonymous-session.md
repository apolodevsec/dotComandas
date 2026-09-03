# 02: Mesa QR Code & Anonymous Session

**What to build:** Allow customers to scan a Mesa QR Code, creating an anonymous temporary `Sessão de Mesa` on the API and loading the menu without authentication.

**Blocked by:** 01: Monorepo Scaffold & Shared Types

**Status:** resolved

- [x] Implement Mesa QR Code payload decoder and session initialization API endpoint
- [x] Store `Sessão de Mesa` JWT token on mobile client
- [x] Display active Mesa header and menu items for the scanned table
