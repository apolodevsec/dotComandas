import { EventEmitter } from 'events';
import { EstadoPedido, podeTransicionarPedido, Pedido } from '@dotcomandas/shared';
import { buscarPedidoPorId } from './pedido-service.js';

export const kdsEvents = new EventEmitter();

export interface KDSEventPayload {
  tipo: 'pedido:criado' | 'pedido:estado_alterado';
  pedido: Pedido;
  timestamp: string;
}

export function notificarNovoPedido(pedido: Pedido) {
  const payload: KDSEventPayload = {
    tipo: 'pedido:criado',
    pedido,
    timestamp: new Date().toISOString(),
  };
  kdsEvents.emit('kds:event', payload);
  return payload;
}

export function transicionarEstadoPedidoKDS(pedidoId: string, novoEstado: EstadoPedido): Pedido {
  const pedido = buscarPedidoPorId(pedidoId);

  if (!podeTransicionarPedido(pedido.estado, novoEstado)) {
    throw new Error(`Transição de estado inválida de '${pedido.estado}' para '${novoEstado}'`);
  }

  pedido.estado = novoEstado;
  pedido.updatedAt = new Date().toISOString();

  const payload: KDSEventPayload = {
    tipo: 'pedido:estado_alterado',
    pedido,
    timestamp: new Date().toISOString(),
  };

  kdsEvents.emit('kds:event', payload);
  return pedido;
}

export function listarFilaKDS(pedidos: Pedido[]) {
  return {
    pendentes: pedidos.filter((p) => p.estado === 'Pendente'),
    emPreparo: pedidos.filter((p) => p.estado === 'Em Preparo'),
    prontos: pedidos.filter((p) => p.estado === 'Pronto'),
  };
}
