export type EstadoPedido = 'Pendente' | 'Em Preparo' | 'Pronto' | 'Entregue' | 'Cancelado';

export interface AdicionalSelecionado {
  opcaoId: string;
  nome: string;
  precoUnitario: number;
}

export interface ItemPedido {
  id: string;
  itemCardapioId: string;
  nome: string;
  precoUnitario: number;
  quantidade: number;
  adicionaisSelecionados: AdicionalSelecionado[];
  observacao?: string;
  precoTotalItem: number;
}

export type OrigemPedido = 'Cliente' | 'Garcom';

export interface Pedido {
  id: string;
  comandaId: string;
  mesaId: string;
  origem: OrigemPedido;
  itens: ItemPedido[];
  total: number;
  estado: EstadoPedido;
  createdAt: string;
  updatedAt: string;
}
