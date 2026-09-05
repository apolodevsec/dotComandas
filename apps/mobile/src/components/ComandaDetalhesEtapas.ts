import { Pedido, ItemPedido, EstadoPedido } from '@dotcomandas/shared';

export interface ItemComandaComEtapa extends ItemPedido {
  etapaNome: string;
  ordemEtapa: number;
  etapaTag: string;
  estadoItem?: EstadoPedido;
}

export function montarListaPlanaItensComEtapa(pedido: Pedido): ItemComandaComEtapa[] {
  if (!pedido.etapas || pedido.etapas.length === 0) {
    return pedido.itens.map((item) => ({
      ...item,
      etapaNome: 'Geral',
      ordemEtapa: 1,
      etapaTag: '[Geral]',
    }));
  }

  const listaPlana: ItemComandaComEtapa[] = [];

  pedido.etapas
    .sort((a, b) => a.ordem - b.ordem)
    .forEach((etapa) => {
      etapa.itens.forEach((item) => {
        listaPlana.push({
          ...item,
          etapaNome: etapa.etapa,
          ordemEtapa: etapa.ordem,
          etapaTag: `[${etapa.etapa}]`,
        });
      });
    });

  return listaPlana;
}

export function podeDispararProximaEtapa(
  pedido: Pedido,
  ordemEtapaAlvo: number
): { podeDisparar: boolean; motivoBloqueio?: string } {
  if (!pedido.etapas || pedido.etapas.length === 0) {
    return { podeDisparar: true };
  }

  if (ordemEtapaAlvo <= 1) {
    return { podeDisparar: true };
  }

  const etapaAnterior = pedido.etapas.find((e) => e.ordem === ordemEtapaAlvo - 1);
  if (!etapaAnterior) {
    return { podeDisparar: true };
  }

  // Verifica se todos os itens da etapa anterior estão 'Pronto' ou 'Entregue'
  const temItensPendentes = etapaAnterior.itens.some((item) => {
    // Se o item tem estado individual definido, checa se não é Pronto/Entregue
    const estadoItem = (item as any).estado as EstadoPedido | undefined;
    if (estadoItem) {
      return estadoItem !== 'Pronto' && estadoItem !== 'Entregue';
    }
    // Por padrão se o pedido geral não está pronto, assume pendente
    return pedido.estado !== 'Pronto' && pedido.estado !== 'Entregue';
  });

  if (temItensPendentes) {
    return {
      podeDisparar: false,
      motivoBloqueio: `Etapa anterior (${etapaAnterior.etapa}) ainda em preparo na cozinha`,
    };
  }

  return { podeDisparar: true };
}

export function validarENotificarDisparoEtapa(
  pedido: Pedido,
  ordemEtapaAlvo: number,
  pin: string
): { sucesso: boolean; erro?: string } {
  if (!pin || pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    return { sucesso: false, erro: 'PIN deve possuir 6 dígitos numéricos' };
  }

  const validacaoTrava = podeDispararProximaEtapa(pedido, ordemEtapaAlvo);
  if (!validacaoTrava.podeDisparar) {
    return { sucesso: false, erro: validacaoTrava.motivoBloqueio };
  }

  return { sucesso: true };
}
