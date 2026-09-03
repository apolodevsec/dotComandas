export interface OpcaoAdicional {
  id: string;
  nome: string;
  preco: number;
}

export type TipoGrupoAdicional = 'Unica' | 'Multipla';

export interface GrupoAdicional {
  id: string;
  nome: string;
  tipo: TipoGrupoAdicional;
  obrigatorio: boolean;
  opcoes: OpcaoAdicional[];
}

export interface CategoriaCardapio {
  id: string;
  nome: string;
  ordem: number;
}

export interface ItemCardapio {
  id: string;
  categoriaId: string;
  nome: string;
  descricao: string;
  precoBase: number;
  imagemUrl?: string;
  disponivel: boolean;
  gruposAdicionais: GrupoAdicional[];
  createdAt: string;
  updatedAt: string;
}
