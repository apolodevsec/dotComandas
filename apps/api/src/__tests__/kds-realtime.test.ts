import { describe, it, expect, beforeEach, vi } from 'vitest';
import { criarPedido, limparBancoDeDadosMemoria } from '../services/pedido-service.js';
import {
  kdsEvents,
  notificarNovoPedido,
  transicionarEstadoPedidoKDS,
  listarFilaKDS,
  KDSEventPayload,
} from '../services/kds-service.js';

describe('Ticket 05: KDS e Eventos em Tempo Real', () => {
  beforeEach(() => {
    limparBancoDeDadosMemoria();
  });

  it('deve emitir evento pedido:criado quando um novo pedido é notificado ao KDS', () => {
    const escutador = vi.fn();
    kdsEvents.on('kds:event', escutador);

    const { pedido } = criarPedido(
      'mesa-1',
      [{ itemCardapioId: 'item-2', quantidade: 1 }],
      'Cliente'
    );

    notificarNovoPedido(pedido);

    expect(escutador).toHaveBeenCalledTimes(1);
    const payloadEmitido: KDSEventPayload = escutador.mock.calls[0][0];
    expect(payloadEmitido.tipo).toBe('pedido:criado');
    expect(payloadEmitido.pedido.id).toBe(pedido.id);

    kdsEvents.off('kds:event', escutador);
  });

  it('deve permitir a cozinha transicionar de Pendente para Em Preparo e depois para Pronto', () => {
    const escutador = vi.fn();
    kdsEvents.on('kds:event', escutador);

    const { pedido } = criarPedido(
      'mesa-1',
      [{ itemCardapioId: 'item-2', quantidade: 1 }],
      'Garcom'
    );

    // 1. Transicionar para Em Preparo
    const pEmPreparo = transicionarEstadoPedidoKDS(pedido.id, 'Em Preparo');
    expect(pEmPreparo.estado).toBe('Em Preparo');

    // 2. Transicionar para Pronto
    const pPronto = transicionarEstadoPedidoKDS(pedido.id, 'Pronto');
    expect(pPronto.estado).toBe('Pronto');

    expect(escutador).toHaveBeenCalledTimes(2);
    kdsEvents.off('kds:event', escutador);
  });

  it('deve rejeitar transições inválidas no KDS', () => {
    const { pedido } = criarPedido(
      'mesa-1',
      [{ itemCardapioId: 'item-2', quantidade: 1 }],
      'Cliente'
    );

    // Tentar pular de Pendente direto para Entregue
    expect(() => transicionarEstadoPedidoKDS(pedido.id, 'Entregue')).toThrowError(
      "Transição de estado inválida de 'Pendente' para 'Entregue'"
    );
  });

  it('deve agrupar corretamente a fila da cozinha por colunas KDS', () => {
    const { pedido: p1 } = criarPedido('mesa-1', [{ itemCardapioId: 'item-2', quantidade: 1 }], 'Cliente');
    const { pedido: p2 } = criarPedido('mesa-2', [{ itemCardapioId: 'item-3', quantidade: 1 }], 'Garcom');
    const { pedido: p3 } = criarPedido('mesa-3', [{ itemCardapioId: 'item-1', quantidade: 1, opcoesSelecionadasIds: ['op-ponto'] }], 'Cliente');

    transicionarEstadoPedidoKDS(p2.id, 'Em Preparo');
    transicionarEstadoPedidoKDS(p3.id, 'Em Preparo');
    transicionarEstadoPedidoKDS(p3.id, 'Pronto');

    const todosPedidos = [p1, p2, p3];
    const fila = listarFilaKDS(todosPedidos);

    expect(fila.pendentes.length).toBe(1);
    expect(fila.pendentes[0].id).toBe(p1.id);

    expect(fila.emPreparo.length).toBe(1);
    expect(fila.emPreparo[0].id).toBe(p2.id);

    expect(fila.prontos.length).toBe(1);
    expect(fila.prontos[0].id).toBe(p3.id);
  });
});
