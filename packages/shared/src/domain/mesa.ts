export type StatusMesa = 'Livre' | 'Ocupada' | 'Reservada';

export interface Mesa {
  id: string;
  numero: number;
  qrCodeUrl: string;
  status: StatusMesa;
  createdAt: string;
  updatedAt: string;
}
