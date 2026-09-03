import { describe, it, expect, beforeEach } from 'vitest';
import { Comanda } from '@dotcomandas/shared';
import {
  salvarComandaAstraDB,
  buscarComandaAstraDB,
  atualizarEstadoComandaAstraDB,
  listarComandasAtivasAstraDB,
  limparRepoFallback,
} from '../services/astradb-repository.js';

describe('Ticket 09: Repositório de Documento de Comanda no Astra DB', () => {
  beforeEach(() => {
    limparRepoFallback();
  });

  it('deve salvar e recuperar um Documento de Comanda completo no repositório Astra DB', async () => {
    const comandaMock: Comanda = {
      id: 'comanda-astradb-1',
      mesaId: 'mesa-2',
      estado: 'Em Atendimento',
      pedidos: [
        {
          id: 'ped-1',
          comandaId: 'comanda-astradb-1',
          mesaId: 'mesa-2',
          origem: 'Cliente',
          estado: 'Em Preparo',
          itens: [
            {
              id: 'item-ped-1',
              itemCardapioId: 'item-1',
              nome: 'Hambúrguer Artesanal',
              precoUnitario: 28.0,
              quantidade: 1,
              adicionaisSelecionados: [{ opcaoId: 'op-bacon', nome: 'Bacon', precoUnitario: 4.5 }],
              precoTotalItem: 32.5,
            },
          ],
          total: 32.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      subtotal: 32.5,
      desconto: 0,
      taxaServico: 0,
      total: 32.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const salva = await salvarComandaAstraDB(comandaMock);
    expect(salva.id).toBe('comanda-astradb-1');

    const recuperada = await buscarComandaAstraDB('comanda-astradb-1');
    expect(recuperada.mesaId).toBe('mesa-2');
    expect(recuperada.pedidos.length).toBe(1);
    expect(recuperada.pedidos[0].itens[0].nome).toBe('Hambúrguer Artesanal');
  });

  it('deve atualizar o estado da comanda no Astra DB de forma atômica', async () => {
    const comandaMock: Comanda = {
      id: 'comanda-astradb-2',
      mesaId: 'mesa-3',
      estado: 'Aberta',
      pedidos: [],
      subtotal: 0,
      desconto: 0,
      taxaServico: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await salvarComandaAstraDB(comandaMock);
    const atualizada = await atualizarEstadoComandaAstraDB('comanda-astradb-2', 'Aguardando Fechamento');

    expect(atualizada.estado).toBe('Aguardando Fechamento');
  });

  it('deve listar apenas comandas ativas', async () => {
    const c1: Comanda = { id: 'c1', mesaId: 'm1', estado: 'Aberta', pedidos: [], subtotal: 0, desconto: 0, taxaServico: 0, total: 0, createdAt: '', updatedAt: '' };
    const c2: Comanda = { id: 'c2', mesaId: 'm2', estado: 'Fechada', pedidos: [], subtotal: 0, desconto: 0, taxaServico: 0, total: 0, createdAt: '', updatedAt: '' };

    await salvarComandaAstraDB(c1);
    await salvarComandaAstraDB(c2);

    const ativas = await listarComandasAtivasAstraDB();
    expect(ativas.some((c) => c.id === 'c1')).toBe(true);
    expect(ativas.some((c) => c.id === 'c2')).toBe(false);
  });
});
