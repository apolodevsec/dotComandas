import jwt from 'jsonwebtoken';
import { Funcionario, PapelFuncionario } from '@dotcomandas/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'dotcomandas-secret-key-dev';

// Mock de funcionários cadastrados no sistema
const FUNCIONARIOS_MOCK: Funcionario[] = [
  {
    id: 'func-1',
    nome: 'Carlos Silva',
    usuario: 'garcom1',
    pinHash: '123456', // 6 dígitos
    papel: 'Garcom',
    ativo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'func-2',
    nome: 'Chef Maria',
    usuario: 'cozinha1',
    pinHash: '654321',
    papel: 'Cozinha',
    ativo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'func-3',
    nome: 'Ana Caixa',
    usuario: 'caixa1',
    pinHash: '111222',
    papel: 'Caixa',
    ativo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'func-4',
    nome: 'Gerente Roberto',
    usuario: 'admin',
    pinHash: '999999',
    papel: 'Admin',
    ativo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export interface StaffTokenPayload {
  sub: string;
  usuario: string;
  nome: string;
  papel: PapelFuncionario;
}

export function autenticarFuncionarioPorPin(usuario: string, pin: string) {
  const funcionario = FUNCIONARIOS_MOCK.find(
    (f) => f.usuario.toLowerCase() === usuario.toLowerCase() && f.ativo
  );

  if (!funcionario) {
    throw new Error('Usuário não encontrado ou inativo');
  }

  if (funcionario.pinHash !== pin) {
    throw new Error('PIN inválido');
  }

  const payload: StaffTokenPayload = {
    sub: funcionario.id,
    usuario: funcionario.usuario,
    nome: funcionario.nome,
    papel: funcionario.papel,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

  return {
    token,
    funcionario: {
      id: funcionario.id,
      nome: funcionario.nome,
      usuario: funcionario.usuario,
      papel: funcionario.papel,
    },
  };
}

export function verificarTokenStaff(token: string): StaffTokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as StaffTokenPayload;
  } catch {
    throw new Error('Token inválido ou expirado');
  }
}

export function validarPermissaoRBAC(papel: PapelFuncionario, papeisPermitidos: PapelFuncionario[]): boolean {
  if (papel === 'Admin') return true; // Admin sempre tem acesso total
  return papeisPermitidos.includes(papel);
}
