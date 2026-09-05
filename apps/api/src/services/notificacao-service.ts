import { EventEmitter } from 'events';
import { Pedido } from '@dotcomandas/shared';
import { kdsEvents, KDSEventPayload } from './kds-service.js';

export const notificacoesEvents = new EventEmitter();

export interface NotificacaoProntoPayload {
  tipo: 'pedido:pronto_notificacao';
  pedidoId: string;
  mesaId: string;
  origem: 'Cliente' | 'Garcom';
  mensagem: string;
  timestamp: string;
}

export interface NotificacaoEtapaConcluidaPayload {
  tipo: 'etapa:concluida_notificacao';
  pedidoId: string;
  mesaId: string;
  ordemEtapaConcluida: number;
  etapaNome: string;
  mensagem: string;
  timestamp: string;
}

// Inscrever servico de notificacao nos eventos do KDS
kdsEvents.on('kds:event', (event: KDSEventPayload) => {
  if (event.tipo === 'pedido:estado_alterado' && event.pedido.estado === 'Pronto') {
    dispararNotificacaoPedidoPronto(event.pedido);
  }
});

export function dispararNotificacaoPedidoPronto(pedido: Pedido): NotificacaoProntoPayload {
  const payload: NotificacaoProntoPayload = {
    tipo: 'pedido:pronto_notificacao',
    pedidoId: pedido.id,
    mesaId: pedido.mesaId,
    origem: pedido.origem,
    mensagem: `O pedido #${pedido.id.slice(-4)} da Mesa ${pedido.mesaId} está PRONTO para entrega!`,
    timestamp: new Date().toISOString(),
  };

  // Transmite para canal de garçons e para a sessão da mesa do cliente
  notificacoesEvents.emit(`garcom:notificacao`, payload);
  notificacoesEvents.emit(`mesa:${pedido.mesaId}:notificacao`, payload);

  return payload;
}

export function dispararNotificacaoEtapaConcluida(
  pedido: Pedido,
  ordemEtapa: number,
  etapaNome: string
): NotificacaoEtapaConcluidaPayload {
  const payload: NotificacaoEtapaConcluidaPayload = {
    tipo: 'etapa:concluida_notificacao',
    pedidoId: pedido.id,
    mesaId: pedido.mesaId,
    ordemEtapaConcluida: ordemEtapa,
    etapaNome,
    mensagem: `A etapa '${etapaNome}' da Mesa ${pedido.mesaId} foi concluída na cozinha!`,
    timestamp: new Date().toISOString(),
  };

  notificacoesEvents.emit('garcom:notificacao', payload);
  notificacoesEvents.emit(`mesa:${pedido.mesaId}:notificacao`, payload);

  return payload;
}
