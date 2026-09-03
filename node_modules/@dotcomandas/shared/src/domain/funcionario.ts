export type PapelFuncionario = 'Admin' | 'Garcom' | 'Cozinha' | 'Caixa';

export interface Funcionario {
  id: string;
  nome: string;
  usuario: string;
  pinHash: string;
  papel: PapelFuncionario;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}
