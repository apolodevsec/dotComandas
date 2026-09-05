import {
  Comanda,
  Pedido,
  ItemPedido,
  AdicionalSelecionado,
  OrigemPedido,
  calcularTotalItemPedido,
  EstadoPedido,
} from '@dotcomandas/shared';
import { buscarItemCardapioPorId } from './cardapio-service.js';
import { buscarMesaPorId } from './mesa-service.js';

// Repositórios em memória para teste/MVP
const COMANDAS_DB: Map<string, Comanda> = new Map();
const PEDIDOS_DB: Map<string, Pedido> = new Map();

export interface ItemPedidoInput {
  itemCardapioId: string;
  quantidade: number;
  opcoesSelecionadasIds?: string[];
  observacao?: string;
}

export function buscarOuCriarComandaAtivaPorMesa(mesaId: string): Comanda {
  buscarMesaPorId(mesaId); // valida se mesa existe

  // Procurar comanda ativa aberta ou em atendimento
  for (const comanda of COMANDAS_DB.values()) {
    if (comanda.mesaId === mesaId && ['Aberta', 'Em Atendimento', 'Aguardando Fechamento'].includes(comanda.estado)) {
      return comanda;
    }
  }

  // Se não existir, criar nova comanda Aberta
  const novaComanda: Comanda = {
    id: `comanda-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    mesaId,
    estado: 'Aberta',
    pedidos: [],
    subtotal: 0,
    desconto: 0,
    taxaServico: 0,
    total: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  COMANDAS_DB.set(novaComanda.id, novaComanda);
  return novaComanda;
}

export function criarPedido(
  mesaId: string,
  itensInput: ItemPedidoInput[],
  origem: OrigemPedido
): { pedido: Pedido; comanda: Comanda } {
  if (!itensInput || itensInput.length === 0) {
    throw new Error('O pedido deve conter pelo menos um item');
  }

  const comanda = buscarOuCriarComandaAtivaPorMesa(mesaId);
  const itensProcessados: ItemPedido[] = [];
  let totalPedido = 0;

  for (const input of itensInput) {
    const itemCardapio = buscarItemCardapioPorId(input.itemCardapioId);
    const idsSelecionados = input.opcoesSelecionadasIds || [];
    const adicionaisSelecionados: AdicionalSelecionado[] = [];

    // Validar grupos de adicionais
    for (const grupo of itemCardapio.gruposAdicionais) {
      const opcoesDoGrupo = grupo.opcoes.filter((op) => idsSelecionados.includes(op.id));

      if (grupo.obrigatorio && grupo.tipo === 'Unica' && opcoesDoGrupo.length !== 1) {
        throw new Error(`Selecione exatamente uma opção para '${grupo.nome}' em '${itemCardapio.nome}'`);
      }

      for (const op of opcoesDoGrupo) {
        adicionaisSelecionados.push({
          opcaoId: op.id,
          nome: op.nome,
          precoUnitario: op.preco,
        });
      }
    }

    const precoTotalItem = calcularTotalItemPedido(
      itemCardapio.precoBase,
      input.quantidade,
      adicionaisSelecionados
    );

    const itemPedido: ItemPedido = {
      id: `item-ped-${Date.now()}-${Math.random()}`,
      itemCardapioId: itemCardapio.id,
      nome: itemCardapio.nome,
      precoUnitario: itemCardapio.precoBase,
      quantidade: input.quantidade,
      adicionaisSelecionados,
      observacao: input.observacao,
      precoTotalItem,
    };

    itensProcessados.push(itemPedido);
    totalPedido += precoTotalItem;
  }

  const novoPedido: Pedido = {
    id: `ped-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    comandaId: comanda.id,
    mesaId,
    origem,
    itens: itensProcessados,
    total: totalPedido,
    estado: 'Pendente',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  PEDIDOS_DB.set(novoPedido.id, novoPedido);

  // Atualizar Comanda
  comanda.pedidos.push(novoPedido);
  comanda.estado = 'Em Atendimento';
  comanda.subtotal += totalPedido;
  comanda.total = comanda.subtotal - comanda.desconto + comanda.taxaServico;
  comanda.updatedAt = new Date().toISOString();

  return { pedido: novoPedido, comanda };
}

export function dispararEtapaPedido(
  pedidoId: string,
  ordemEtapa: number,
  pinFuncionarios: string
): Pedido {
  if (!pinFuncionarios || pinFuncionarios.length !== 6 || !/^\d{6}$/.test(pinFuncionarios)) {
    throw new Error('PIN deve possuir 6 dígitos numéricos');
  }

  const pedido = PEDIDOS_DB.get(pedidoId);
  if (!pedido) {
    throw new Error('Pedido não encontrado');
  }

  if (!pedido.etapas || pedido.etapas.length === 0) {
    return pedido;
  }

  const etapaAlvo = pedido.etapas.find((e) => e.ordem === ordemEtapa);
  if (!etapaAlvo) {
    throw new Error(`Etapa ${ordemEtapa} não encontrada no pedido`);
  }

  // Validação do Bloqueio Sequencial Estrito
  if (ordemEtapa > 1) {
    const etapaAnterior = pedido.etapas.find((e) => e.ordem === ordemEtapa - 1);
    if (etapaAnterior) {
      const temItensIncompletos = etapaAnterior.itens.some((item) => {
        const estadoItem = (item as any).estado as EstadoPedido | undefined;
        if (estadoItem) {
          return estadoItem !== 'Pronto' && estadoItem !== 'Entregue';
        }
        return pedido.estado !== 'Pronto' && pedido.estado !== 'Entregue';
      });

      if (temItensIncompletos) {
        throw new Error('ETAPA_ANTERIOR_PENDENTE: A etapa anterior ainda está em preparo na cozinha');
      }
    }
  }

  etapaAlvo.statusDisparo = 'Liberado';
  pedido.updatedAt = new Date().toISOString();
  return pedido;
}

export function registrarPedidoDireto(pedido: Pedido): void {
  PEDIDOS_DB.set(pedido.id, pedido);
}

export function buscarComandaPorId(comandaId: string): Comanda {
  const comanda = COMANDAS_DB.get(comandaId);
  if (!comanda) {
    throw new Error('Comanda não encontrada');
  }
  return comanda;
}

export function buscarPedidoPorId(pedidoId: string): Pedido {
  const pedido = PEDIDOS_DB.get(pedidoId);
  if (!pedido) {
    throw new Error('Pedido não encontrado');
  }
  return pedido;
}

export function limparBancoDeDadosMemoria() {
  COMANDAS_DB.clear();
  PEDIDOS_DB.clear();
}
