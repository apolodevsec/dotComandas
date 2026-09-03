import { Comanda, EstadoComanda } from '@dotcomandas/shared';
import { obterInstanciaAstraDB } from '../config/astra-client.js';

// Repositório em memória como fallback para testes sem rede
const REPO_FALLBACK: Map<string, Comanda> = new Map();

export async function salvarComandaAstraDB(comanda: Comanda): Promise<Comanda> {
  const db = obterInstanciaAstraDB();

  if (db) {
    try {
      const colecao = db.collection('comandas');
      await colecao.updateOne(
        { _id: comanda.id },
        { $set: { ...comanda, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return comanda;
    } catch (error) {
      console.warn('[AstraDB Repo] Erro ao salvar comanda no Astra DB, usando repositório local:', error);
    }
  }

  // Fallback em memória
  REPO_FALLBACK.set(comanda.id, { ...comanda, updatedAt: new Date().toISOString() });
  return comanda;
}

export async function buscarComandaAstraDB(comandaId: string): Promise<Comanda> {
  const db = obterInstanciaAstraDB();

  if (db) {
    try {
      const colecao = db.collection('comandas');
      const doc = await colecao.findOne({ _id: comandaId });
      if (doc) {
        const { _id, ...dadosComanda } = doc as any;
        return { id: _id, ...dadosComanda } as Comanda;
      }
    } catch (error) {
      console.warn('[AstraDB Repo] Erro ao buscar comanda no Astra DB, usando repositório local:', error);
    }
  }

  const comandaLocal = REPO_FALLBACK.get(comandaId);
  if (!comandaLocal) {
    throw new Error(`Comanda '${comandaId}' não encontrada no Astra DB`);
  }
  return comandaLocal;
}

export async function atualizarEstadoComandaAstraDB(
  comandaId: string,
  novoEstado: EstadoComanda
): Promise<Comanda> {
  const comanda = await buscarComandaAstraDB(comandaId);
  comanda.estado = novoEstado;
  comanda.updatedAt = new Date().toISOString();
  return salvarComandaAstraDB(comanda);
}

export async function listarComandasAtivasAstraDB(): Promise<Comanda[]> {
  const db = obterInstanciaAstraDB();

  if (db) {
    try {
      const colecao = db.collection('comandas');
      const cursor = colecao.find({
        estado: { $in: ['Aberta', 'Em Atendimento', 'Aguardando Fechamento'] },
      });
      const docs = await cursor.toArray();
      return docs.map((doc: any) => {
        const { _id, ...dados } = doc;
        return { id: _id, ...dados } as Comanda;
      });
    } catch (error) {
      console.warn('[AstraDB Repo] Erro ao listar comandas ativas no Astra DB:', error);
    }
  }

  return Array.from(REPO_FALLBACK.values()).filter((c) =>
    ['Aberta', 'Em Atendimento', 'Aguardando Fechamento'].includes(c.estado)
  );
}

export function limparRepoFallback() {
  REPO_FALLBACK.clear();
}
