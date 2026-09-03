import jwt from 'jsonwebtoken';
import { Mesa } from '@dotcomandas/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'dotcomandas-secret-key-dev';

// Mock de Mesas cadastradas
const MESAS_MOCK: Mesa[] = [
  { id: 'mesa-1', numero: 1, qrCodeUrl: 'https://dotcomandas.app/qr/mesa-1', status: 'Livre', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'mesa-2', numero: 2, qrCodeUrl: 'https://dotcomandas.app/qr/mesa-2', status: 'Livre', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'mesa-3', numero: 3, qrCodeUrl: 'https://dotcomandas.app/qr/mesa-3', status: 'Livre', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'mesa-4', numero: 4, qrCodeUrl: 'https://dotcomandas.app/qr/mesa-4', status: 'Livre', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'mesa-5', numero: 5, qrCodeUrl: 'https://dotcomandas.app/qr/mesa-5', status: 'Livre', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export interface MesaTokenPayload {
  tipo: 'ClienteMesa';
  mesaId: string;
  numeroMesa: number;
}

export function buscarMesaPorId(mesaId: string): Mesa {
  const mesa = MESAS_MOCK.find((m) => m.id === mesaId);
  if (!mesa) {
    throw new Error('Mesa não encontrada');
  }
  return mesa;
}

export function iniciarSessaoMesaPorQrCode(qrPayload: string) {
  // O payload pode ser o ID direto "mesa-1" ou URL "https://dotcomandas.app/qr/mesa-1"
  let mesaId = qrPayload;
  if (qrPayload.includes('/qr/')) {
    mesaId = qrPayload.split('/qr/')[1];
  }

  const mesa = buscarMesaPorId(mesaId);

  const payload: MesaTokenPayload = {
    tipo: 'ClienteMesa',
    mesaId: mesa.id,
    numeroMesa: mesa.numero,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' });

  return {
    token,
    mesa: {
      id: mesa.id,
      numero: mesa.numero,
      status: mesa.status,
    },
  };
}

export function verificarTokenSessaoMesa(token: string): MesaTokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as MesaTokenPayload;
    if (decoded.tipo !== 'ClienteMesa') {
      throw new Error('Token não pertence a uma sessão de mesa');
    }
    return decoded;
  } catch {
    throw new Error('Sessão de mesa inválida ou expirada');
  }
}
