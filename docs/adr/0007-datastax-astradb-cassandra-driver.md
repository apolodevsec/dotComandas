# Persistência com Astra DB (DataStax Cassandra Cloud)

Adotamos **Astra DB** (Cassandra Cloud) da DataStax como o banco de dados principal de persistência da API do **dotComandas**. O driver oficial DataStax TypeScript SDK (`@datastax/astra-db-ts` / `cassandra-driver`) é utilizado para conectar e manipular as coleções e tabelas da aplicação. Para ambiente de testes e desenvolvimento local sem credenciais ativas, o sistema utiliza um driver em memória (*fallback repository*) de forma transparente.
