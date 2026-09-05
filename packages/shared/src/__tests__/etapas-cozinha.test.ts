import { describe, it, expect } from 'vitest';
import { Pedido, EtapaPedido, StatusDisparoEtapa } from '../domain/pedido.js';
import { ItemCardapio } from '../domain/cardapio.js';

describe('Ticket 14: Modelagem de Etapas de Cozinha e Harmonização', () => {
  it('deve permitir criar um item de cardápio com harmonização sugerida', () => {
    const item: ItemCardapio = {
      id: 'item-wagyu',
      categoriaId: 'cat-pratos',
      nome: 'Hambúrguer Wagyū',
      descricao: 'Carne de Wagyū com trufas',
      precoBase: 85,
      disponivel: true,
      gruposAdicionais: [],
      harmonizacao: 'Vinho Tinto Barolo Reserva 2016',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(item.harmonizacao).toBe('Vinho Tinto Barolo Reserva 2016');
  });

  it('deve permitir encadear etapas de cozinha no pedido com status de disparo', () => {
    const etapas: EtapaPedido[] = [
      {
        ordem: 1,
        etapa: 'Entrada',
        statusDisparo: 'Liberado',
        itens: [
          {
            id: 'i-1',
            itemCardapioId: 'item-bruschetta',
            nome: 'Bruschetta de Pomodoro',
            precoUnitario: 32,
            quantidade: 1,
            adicionaisSelecionados: [],
            precoTotalItem: 32,
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
            nome: 'Hambúrguer Wagyū',
            precoUnitario: 85,
            quantidade: 1,
            adicionaisSelecionados: [],
            precoTotalItem: 85,
          },
        ],
      },
    ];

    const pedido: Pedido = {
      id: 'ped-degustacao',
      comandaId: 'comanda-01',
      mesaId: '04',
      origem: 'Garcom',
      itens: [],
      etapas,
      total: 117,
      estado: 'Em Preparo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(pedido.etapas?.length).toBe(2);
    expect(pedido.etapas?.[0].statusDisparo).toBe('Liberado');
    expect(pedido.etapas?.[1].statusDisparo).toBe('Aguardando Disparo');
  });
});
