import { EstadoPedido } from './domain/pedido.js';
import { EstadoComanda } from './domain/comanda.js';

const TRANSIÇÕES_VALIDAS_PEDIDO: Record<EstadoPedido, EstadoPedido[]> = {
  Pendente: ['Em Preparo', 'Cancelado'],
  'Em Preparo': ['Pronto', 'Cancelado'],
  Pronto: ['Entregue', 'Cancelado'],
  Entregue: [],
  Cancelado: [],
};

const TRANSIÇÕES_VALIDAS_COMANDA: Record<EstadoComanda, EstadoComanda[]> = {
  Aberta: ['Em Atendimento', 'Aguardando Fechamento', 'Cancelada'],
  'Em Atendimento': ['Aguardando Fechamento', 'Cancelada'],
  'Aguardando Fechamento': ['Fechada', 'Em Atendimento', 'Cancelada'],
  Fechada: [],
  Cancelada: [],
};

export function podeTransicionarPedido(de: EstadoPedido, para: EstadoPedido): boolean {
  const transicoesPermitidas = TRANSIÇÕES_VALIDAS_PEDIDO[de] || [];
  return transicoesPermitidas.includes(para);
}

export function podeTransicionarComanda(de: EstadoComanda, para: EstadoComanda): boolean {
  const transicoesPermitidas = TRANSIÇÕES_VALIDAS_COMANDA[de] || [];
  return transicoesPermitidas.includes(para);
}

export function calcularTotalItemPedido(
  precoBase: number,
  quantidade: number,
  adicionais: { precoUnitario: number }[] = []
): number {
  const custoAdicionais = adicionais.reduce((acc, item) => acc + item.precoUnitario, 0);
  return (precoBase + custoAdicionais) * quantidade;
}
