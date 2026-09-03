import path from 'path';
import dotenv from 'dotenv';
import { DataAPIClient, Db } from '@datastax/astra-db-ts';

// Carregar .env do diretorio local ou da raiz do monorepo
dotenv.config(); // tenta no CWD
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') }); // tenta na raiz do monorepo
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') }); // tenta relativo ao arquivo

const token = process.env.ASTRA_DB_APPLICATION_TOKEN;
const endpoint = process.env.ASTRA_DB_API_ENDPOINT;

let client: DataAPIClient | null = null;
let db: Db | null = null;

if (token && endpoint) {
  try {
    client = new DataAPIClient(token);
    db = client.db(endpoint);
    console.log('[AstraDB] ✅ Conectado com sucesso ao Astra DB DataStax (US-East-2)!');
  } catch (error) {
    console.warn('[AstraDB] ⚠️ Falha ao inicializar a conexão Astra DB, usando modo fallback:', error);
  }
} else {
  console.log('[AstraDB] ℹ️ Credenciais ausentes no .env. Operando em modo de memória local.');
}

export function obterInstanciaAstraDB(): Db | null {
  return db;
}

export function estaConectadoAstraDB(): boolean {
  return db !== null;
}
