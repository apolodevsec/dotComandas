# 09: Repositório de Persistência de Documento de Comanda no Astra DB

**What to build:** Build the Astra DB persistence repository in `apps/api` using the DataStax SDK (`db.collection('comandas')`) to save, update, and query nested Comanda Documents with automated fallback support for testing.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Implement Astra DB Comanda repository methods (salvarComandaAstraDB, buscarComandaAstraDB, atualizarEstadoComandaAstraDB)
- [x] Support nested JSON document structures for pedidos and item adicionais
- [x] Create automated integration tests verifying Astra DB document CRUD operations
