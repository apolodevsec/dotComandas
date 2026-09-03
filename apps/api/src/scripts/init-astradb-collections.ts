import 'dotenv/config';
import { DataAPIClient } from '@datastax/astra-db-ts';

async function inicializarColecoes() {
  const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
  const endpoint = process.env.ASTRA_DB_API_ENDPOINT;

  if (!token || !endpoint) {
    console.error('Credenciais do Astra DB ausentes');
    process.exit(1);
  }

  const client = new DataAPIClient(token);
  const db = client.db(endpoint);

  const colecoesDesejadas = ['comandas', 'pedidos', 'cardapio', 'funcionarios', 'pagamentos', 'mesas'];

  console.log('--- Inicializando Coleções no Astra DB DataStax ---');
  const colecoesExistentes = await db.listCollections();
  const nomesExistentes = colecoesExistentes.map((c) => c.name);

  for (const nomeColecao of colecoesDesejadas) {
    if (!nomesExistentes.includes(nomeColecao)) {
      console.log(`Criando coleção '${nomeColecao}'...`);
      await db.createCollection(nomeColecao);
      console.log(`✅ Coleção '${nomeColecao}' criada com sucesso.`);
    } else {
      console.log(`ℹ️ Coleção '${nomeColecao}' já existe.`);
    }
  }

  console.log('--- Inicialização Concluída ---');
  const atualizadas = await db.listCollections();
  console.log('Coleções ativas no Astra DB:', atualizadas.map((c) => c.name));
}

inicializarColecoes();
