import { DataAPIClient, Db } from '@datastax/astra-db-ts';

const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
const endpoint = process.env.ASTRA_DB_API_ENDPOINT;
const keyspace = process.env.ASTRA_DB_KEYSPACE || 'default_keyspace';

let client: DataAPIClient | null = null;
let db: Db | null = null;

if (token && endpoint) {
  try {
    client = new DataAPIClient(token);
    db = client.db(endpoint, { keyspace });
    console.log('[AstraDB] Conectado com sucesso ao Astra DB DataStax!');
  } catch (error) {
    console.warn('[AstraDB] Falha ao inicializar o cliente Astra DB, operando em modo fallback:', error);
  }
} else {
  console.log('[AstraDB] Credenciais ASTRA_DB_APPLICATION_TOKEN e ASTRA_DB_API_ENDPOINT não configuradas. Operando com armazenamento em memória.');
}

export function obterInstanciaAstraDB(): Db | null {
  return db;
}

export function estaConectadoAstraDB(): boolean {
  return db !== null;
}
