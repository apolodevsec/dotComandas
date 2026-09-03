import { describe, it, expect, beforeEach, vi } from 'vitest';
import { criarPedido, limparBancoDeDadosMemoria } from '../services/pedido-service.js';
import { transicionarEstadoPedidoKDS } from '../services/kds-service.js';
import { notificacoesEvents, NotificacaoProntoPayload } from '../services/notificacao-service.js';

describe('Ticket 06: Notificações em Tempo Real para Garçom e Cliente', () => {
  beforeEach(() => {
    limparBancoDeDadosMemoria();
  });

  it('deve disparar notificação automática nos canais de garçom e mesa quando pedido fica PRONTO', () => {
    const escutadorGarcom = vi.fn();
    const escutadorMesa = vi.fn();

    notificacoesEvents.on('garcom:notificacao', escutadorGarcom);
    notificacoesEvents.on('mesa:mesa-1:notificacao', escutadorMesa);

    const { pedido } = criarPedido(
      'mesa-1',
      [{ itemCardapioId: 'item-2', quantidade: 1 }],
      'Cliente'
    );

    // 1. Mudança para Em Preparo (não deve notificar garçom de pronto)
    transicionarEstadoPedidoKDS(pedido.id, 'Em Preparo');
    expect(escutadorGarcom).not.toHaveBeenCalled();

    // 2. Mudança para Pronto (deve notificar garçom e mesa-1)
    transicionarEstadoPedidoKDS(pedido.id, 'Pronto');

    expect(escutadorGarcom).toHaveBeenCalledTimes(1);
    expect(escutadorMesa).toHaveBeenCalledTimes(1);

    const payloadGarcom: NotificacaoProntoPayload = escutadorGarcom.mock.calls[0][0];
    expect(payloadGarcom.tipo).toBe('pedido:pronto_notificacao');
    expect(payloadGarcom.mesaId).toBe('mesa-1');
    expect(payloadGarcom.mensagem).toContain('PRONTO para entrega');

    notificacoesEvents.off('garcom:notificacao', escutadorGarcom);
    notificacoesEvents.off('mesa:mesa-1:notificacao', escutadorMesa);
  });
});
