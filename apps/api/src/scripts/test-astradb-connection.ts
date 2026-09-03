import 'dotenv/config';
import { DataAPIClient } from '@datastax/astra-db-ts';

async function testarConexao() {
  const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
  const endpoint = process.env.ASTRA_DB_API_ENDPOINT;

  console.log('--- Testando Conexão com Astra DB (DataStax) ---');
  console.log('Endpoint:', endpoint);
  console.log('Token presente:', !!token);

  if (!token || !endpoint) {
    console.error('ERRO: Token ou Endpoint ausente no .env');
    process.exit(1);
  }

  try {
    const client = new DataAPIClient(token);
    const db = client.db(endpoint);

    console.log('Conectando ao banco de dados...');
    const collections = await db.listCollections();
    console.log('✅ Sucesso! Conectado ao Astra DB.');
    console.log('Coleções existentes:', collections);
  } catch (error) {
    console.error('❌ Falha na conexão com Astra DB:', error);
  }
}

testarConexao();
