import {
  Comanda,
  FormaPagamento,
  RegistroPagamento,
  podeTransicionarComanda,
} from '@dotcomandas/shared';
import { buscarComandaPorId } from './pedido-service.js';
import { buscarMesaPorId } from './mesa-service.js';
import { EventEmitter } from 'events';

export const caixaEvents = new EventEmitter();

const PAGAMENTOS_DB: Map<string, RegistroPagamento> = new Map();

export function obterResumoCaixaComanda(comandaId: string) {
  const comanda = buscarComandaPorId(comandaId);
  const mesa = buscarMesaPorId(comanda.mesaId);

  return {
    comandaId: comanda.id,
    mesaNumero: mesa.numero,
    estado: comanda.estado,
    pedidos: comanda.pedidos,
    subtotal: comanda.subtotal,
    desconto: comanda.desconto,
    taxaServico: comanda.taxaServico,
    total: comanda.total,
  };
}

export function aplicarDescontoETaxaComanda(
  comandaId: string,
  desconto: number = 0,
  taxaServico: number = 0
): Comanda {
  const comanda = buscarComandaPorId(comandaId);

  if (comanda.estado === 'Fechada' || comanda.estado === 'Cancelada') {
    throw new Error(`Não é possível alterar valores de uma comanda ${comanda.estado}`);
  }

  comanda.desconto = desconto;
  comanda.taxaServico = taxaServico;
  comanda.total = comanda.subtotal - comanda.desconto + comanda.taxaServico;
  comanda.updatedAt = new Date().toISOString();

  return comanda;
}

export function registrarPagamentoEFecharComanda(
  comandaId: string,
  formaPagamento: FormaPagamento,
  valor: number,
  operadorId: string
): { comanda: Comanda; pagamento: RegistroPagamento } {
  const comanda = buscarComandaPorId(comandaId);
  const mesa = buscarMesaPorId(comanda.mesaId);

  if (valor < comanda.total) {
    throw new Error(`Valor pago R$ ${valor.toFixed(2)} é inferior ao total da comanda R$ ${comanda.total.toFixed(2)}`);
  }

  // Transicionar para Aguardando Fechamento se estiver Aberta ou Em Atendimento
  if (comanda.estado === 'Aberta' || comanda.estado === 'Em Atendimento') {
    comanda.estado = 'Aguardando Fechamento';
  }

  // Transicionar para Fechada se permitido
  if (!podeTransicionarComanda(comanda.estado, 'Fechada')) {
    throw new Error(`Transição de estado inválida de '${comanda.estado}' para 'Fechada'`);
  }

  const registroPagamento: RegistroPagamento = {
    id: `pag-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    comandaId: comanda.id,
    formaPagamento,
    valor,
    operadorId,
    createdAt: new Date().toISOString(),
  };

  PAGAMENTOS_DB.set(registroPagamento.id, registroPagamento);

  comanda.estado = 'Fechada';
  comanda.updatedAt = new Date().toISOString();
  mesa.status = 'Livre';

  caixaEvents.emit('caixa:event', {
    tipo: 'comanda:fechada',
    comandaId: comanda.id,
    mesaId: mesa.id,
    mesaNumero: mesa.numero,
    total: comanda.total,
    formaPagamento,
    timestamp: new Date().toISOString(),
  });

  return { comanda, pagamento: registroPagamento };
}

export function limparPagamentosMemoria() {
  PAGAMENTOS_DB.clear();
}
