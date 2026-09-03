import { describe, it, expect, beforeEach } from 'vitest';
import {
  criarPedido,
  limparBancoDeDadosMemoria,
} from '../services/pedido-service.js';

describe('Ticket 04: Lançamento de Pedidos com Personalização e Adicionais', () => {
  beforeEach(() => {
    limparBancoDeDadosMemoria();
  });

  it('deve criar um Pedido com sucesso e calcular o valor total incluindo adicionais', () => {
    const resultado = criarPedido(
      'mesa-1',
      [
        {
          itemCardapioId: 'item-1', // Hambúrguer Artesanal (R$ 28.00)
          quantidade: 2,
          opcoesSelecionadasIds: ['op-ponto', 'op-bacon', 'op-queijo'], // Ao ponto ($0), Bacon ($4.5), Queijo ($3.0)
          observacao: 'Sem pimenta no lanche',
        },
        {
          itemCardapioId: 'item-2', // Refrigerante (R$ 6.00)
          quantidade: 1,
        },
      ],
      'Cliente'
    );

    expect(resultado.pedido.id).toBeDefined();
    expect(resultado.pedido.estado).toBe('Pendente');
    expect(resultado.pedido.origem).toBe('Cliente');

    // Item 1: (28 + 4.5 + 3.0) * 2 = 71.00
    // Item 2: 6.00 * 1 = 6.00
    // Total Pedido: 77.00
    expect(resultado.pedido.total).toBe(77.0);

    // Comanda deve estar ativa e atualizada
    expect(resultado.comanda.estado).toBe('Em Atendimento');
    expect(resultado.comanda.subtotal).toBe(77.0);
    expect(resultado.comanda.pedidos.length).toBe(1);
  });

  it('deve rejeitar pedido se opção obrigatória de grupo único não for selecionada', () => {
    expect(() =>
      criarPedido(
        'mesa-1',
        [
          {
            itemCardapioId: 'item-1',
            quantidade: 1,
            opcoesSelecionadasIds: ['op-bacon'], // Faltou o Ponto da Carne (obrigatorio)
          },
        ],
        'Garcom'
      )
    ).toThrowError("Selecione exatamente uma opção para 'Ponto da Carne' em 'Hambúrguer Artesanal'");
  });

  it('deve permitir lançar múltiplos pedidos na mesma comanda somando os valores', () => {
    // Primeiro pedido pelo Cliente
    const p1 = criarPedido(
      'mesa-2',
      [{ itemCardapioId: 'item-2', quantidade: 2 }], // 6 * 2 = 12
      'Cliente'
    );

    expect(p1.comanda.subtotal).toBe(12.0);

    // Segundo pedido pelo Garçom na mesma mesa
    const p2 = criarPedido(
      'mesa-2',
      [{ itemCardapioId: 'item-3', quantidade: 1 }], // 12 * 1 = 12
      'Garcom'
    );

    expect(p2.comanda.id).toBe(p1.comanda.id);
    expect(p2.comanda.pedidos.length).toBe(2);
    expect(p2.comanda.subtotal).toBe(24.0);
  });
});
