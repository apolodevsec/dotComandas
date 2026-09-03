# Modelagem por Documentos JSON Aninhados no Astra DB

Adotamos a modelagem baseada em **Documentos JSON Aninhados** na coleção `comandas` do DataStax Astra DB (`db.collection('comandas')`). Cada documento armazena os metadados da comanda juntamente com o array completo de seus pedidos, itens e adicionais selecionados. Essa decisão elimina operações custosas de junção (*JOINs*) no Cassandra, garante leitura e gravação atômica da comanda em uma única requisição HTTP/gRPC e oferece alta performance operacional no restaurante.
