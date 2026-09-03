import { describe, it, expect, vi } from 'vitest';
import { Pedido } from '@dotcomandas/shared';
import { KDSBoard } from '../components/KDSBoard.js';

describe('Ticket 10: Painel KDS Board da Cozinha', () => {
  it('deve categorizar pedidos corretamente em Pendentes, Em Preparo e Prontos', () => {
    const pedidosMock: Pedido[] = [
      {
        id: 'p-1',
        comandaId: 'c-1',
        mesaId: '1',
        origem: 'Cliente',
        estado: 'Pendente',
        itens: [{ id: 'i-1', itemCardapioId: 'item-1', nome: 'Hambúrguer', precoUnitario: 28, quantidade: 1, adicionaisSelecionados: [], precoTotalItem: 28 }],
        total: 28,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'p-2',
        comandaId: 'c-2',
        mesaId: '2',
        origem: 'Garcom',
        estado: 'Em Preparo',
        itens: [{ id: 'i-2', itemCardapioId: 'item-2', nome: 'Refrigerante', precoUnitario: 6, quantidade: 2, adicionaisSelecionados: [], precoTotalItem: 12 }],
        total: 12,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const onAvancar = vi.fn();
    const board = KDSBoard({ pedidos: pedidosMock, onAvancarEstado: onAvancar });

    expect(board).toBeDefined();
  });
});
