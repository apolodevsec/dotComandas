import {
  ItemCardapio,
  Funcionario,
  PapelFuncionario,
  CategoriaCardapio,
} from '@dotcomandas/shared';
import { CARDAPIO_MOCK, CATEGORIAS_MOCK } from './cardapio-service.js';

const FUNCIONARIOS_DB: Map<string, Funcionario> = new Map();

// Inicializar com mocks padrao
FUNCIONARIOS_DB.set('func-1', {
  id: 'func-1',
  nome: 'Carlos Silva',
  usuario: 'garcom1',
  pinHash: '123456',
  papel: 'Garcom',
  ativo: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function criarItemCardapioAdmin(dados: Omit<ItemCardapio, 'id' | 'createdAt' | 'updatedAt'>): ItemCardapio {
  const novoItem: ItemCardapio = {
    id: `item-${Date.now()}`,
    ...dados,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  CARDAPIO_MOCK.push(novoItem);
  return novoItem;
}

export function criarFuncionarioAdmin(dados: {
  nome: string;
  usuario: string;
  pin: string;
  papel: PapelFuncionario;
}): Funcionario {
  if (!dados.pin || dados.pin.length !== 6 || !/^\d+$/.test(dados.pin)) {
    throw new Error('O PIN do funcionário deve conter exatamente 6 dígitos numéricos');
  }

  const novoFuncionario: Funcionario = {
    id: `func-${Date.now()}`,
    nome: dados.nome,
    usuario: dados.usuario,
    pinHash: dados.pin, // hash/string numérico de 6 dígitos
    papel: dados.papel,
    ativo: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  FUNCIONARIOS_DB.set(novoFuncionario.id, novoFuncionario);
  return novoFuncionario;
}

export function listarFuncionariosAdmin(): Funcionario[] {
  return Array.from(FUNCIONARIOS_DB.values());
}
