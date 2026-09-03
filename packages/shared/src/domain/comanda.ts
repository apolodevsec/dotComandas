import { Pedido } from './pedido.js';

export type EstadoComanda = 'Aberta' | 'Em Atendimento' | 'Aguardando Fechamento' | 'Fechada' | 'Cancelada';

export interface Comanda {
  id: string;
  mesaId: string;
  identificadorCliente?: string;
  estado: EstadoComanda;
  pedidos: Pedido[];
  subtotal: number;
  desconto: number;
  taxaServico: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
