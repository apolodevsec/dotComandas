export type FormaPagamento = 'Dinheiro' | 'Credito' | 'Debito' | 'Pix';

export interface RegistroPagamento {
  id: string;
  comandaId: string;
  formaPagamento: FormaPagamento;
  valor: number;
  operadorId: string;
  detalhes?: string;
  createdAt: string;
}
