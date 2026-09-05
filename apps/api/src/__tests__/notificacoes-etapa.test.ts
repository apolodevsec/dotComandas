import { describe, it, expect, vi } from 'vitest';
import {
  dispararNotificacaoEtapaConcluida,
  notificacoesEvents,
} from '../services/notificacao-service.js';
import { Pedido } from '@dotcomandas/shared';

describe('Ticket 17: Evento Realtime ETAPA_CONCLUIDA via WebSockets', () => {
  it('deve emitir evento de notificação quando uma etapa for concluída na cozinha', () => {
    const listenerGarcom = vi.fn();
    notificacoesEvents.on('garcom:notificacao', listenerGarcom);

    const pedidoMock: Pedido = {
      id: 'ped-etapa-1',
      comandaId: 'comanda-04',
      mesaId: '04',
      origem: 'Garcom',
      itens: [],
      total: 150,
      estado: 'Pronto',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const payload = dispararNotificacaoEtapaConcluida(pedidoMock, 1, 'Entrada');

    expect(payload.tipo).toBe('etapa:concluida_notificacao');
    expect(payload.ordemEtapaConcluida).toBe(1);
    expect(payload.etapaNome).toBe('Entrada');
    expect(listenerGarcom).toHaveBeenCalledWith(payload);

    notificacoesEvents.off('garcom:notificacao', listenerGarcom);
  });
});
