import { describe, it, expect, beforeEach } from 'vitest';
import {
  dispararEtapaPedido,
  registrarPedidoDireto,
  limparBancoDeDadosMemoria,
} from '../services/pedido-service.js';
import { Pedido } from '@dotcomandas/shared';

describe('Ticket 16: Validação Estrita do Bloqueio Sequencial na API de Pedidos', () => {
  beforeEach(() => {
    limparBancoDeDadosMemoria();
  });

  it('deve validar o PIN de 6 dígitos ao disparar etapa', () => {
    expect(() => dispararEtapaPedido('ped-invalido', 1, '123')).toThrow('PIN deve possuir 6 dígitos numéricos');
  });

  it('deve rejeitar disparo da etapa 2 se a etapa 1 ainda estiver pendente (ETAPA_ANTERIOR_PENDENTE)', () => {
    const pedidoMock: Pedido = {
      id: 'ped-teste-etapa',
      comandaId: 'comanda-1',
      mesaId: '04',
      origem: 'Garcom',
      itens: [],
      total: 100,
      estado: 'Em Preparo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      etapas: [
        {
          ordem: 1,
          etapa: 'Entrada',
          statusDisparo: 'Liberado',
          itens: [
            {
              id: 'i-1',
              itemCardapioId: 'item-bruschetta',
              nome: 'Bruschetta',
              precoUnitario: 30,
              quantidade: 1,
              adicionaisSelecionados: [],
              precoTotalItem: 30,
            },
          ],
        },
        {
          ordem: 2,
          etapa: 'Prato Principal',
          statusDisparo: 'Aguardando Disparo',
          itens: [
            {
              id: 'i-2',
              itemCardapioId: 'item-wagyu',
              nome: 'Wagyū',
              precoUnitario: 70,
              quantidade: 1,
              adicionaisSelecionados: [],
              precoTotalItem: 70,
            },
          ],
        },
      ],
    };

    registrarPedidoDireto(pedidoMock);

    expect(() => dispararEtapaPedido('ped-teste-etapa', 2, '123456')).toThrow(
      'ETAPA_ANTERIOR_PENDENTE'
    );
  });

  it('deve permitir o disparo da etapa 2 quando a etapa 1 estiver com estado Pronto ou Entregue', () => {
    const pedidoConcluido: Pedido = {
      id: 'ped-teste-etapa-2',
      comandaId: 'comanda-1',
      mesaId: '04',
      origem: 'Garcom',
      itens: [],
      total: 100,
      estado: 'Pronto',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      etapas: [
        {
          ordem: 1,
          etapa: 'Entrada',
          statusDisparo: 'Liberado',
          itens: [
            {
              id: 'i-1',
              itemCardapioId: 'item-bruschetta',
              nome: 'Bruschetta',
              precoUnitario: 30,
              quantidade: 1,
              adicionaisSelecionados: [],
              precoTotalItem: 30,
            },
          ],
        },
        {
          ordem: 2,
          etapa: 'Prato Principal',
          statusDisparo: 'Aguardando Disparo',
          itens: [
            {
              id: 'i-2',
              itemCardapioId: 'item-wagyu',
              nome: 'Wagyū',
              precoUnitario: 70,
              quantidade: 1,
              adicionaisSelecionados: [],
              precoTotalItem: 70,
            },
          ],
        },
      ],
    };

    registrarPedidoDireto(pedidoConcluido);

    const atualizado = dispararEtapaPedido('ped-teste-etapa-2', 2, '123456');
    expect(atualizado.etapas![1].statusDisparo).toBe('Liberado');
  });
});
