import { ItemCardapio, CategoriaCardapio } from '@dotcomandas/shared';

export const CATEGORIAS_MOCK: CategoriaCardapio[] = [
  { id: 'cat-1', nome: 'Lanches', ordem: 1 },
  { id: 'cat-2', nome: 'Bebidas', ordem: 2 },
  { id: 'cat-3', nome: 'Sobremesas', ordem: 3 },
];

export const CARDAPIO_MOCK: ItemCardapio[] = [
  {
    id: 'item-1',
    categoriaId: 'cat-1',
    nome: 'Hambúrguer Artesanal',
    descricao: 'Blend 180g, queijo cheddar, alface e tomate no pão brioche.',
    precoBase: 28.0,
    disponivel: true,
    gruposAdicionais: [
      {
        id: 'grupo-ponto',
        nome: 'Ponto da Carne',
        tipo: 'Unica',
        obrigatorio: true,
        opcoes: [
          { id: 'op-mal', nome: 'Mal Passada', preco: 0 },
          { id: 'op-ponto', nome: 'Ao Ponto', preco: 0 },
          { id: 'op-bem', nome: 'Bem Passada', preco: 0 },
        ],
      },
      {
        id: 'grupo-extras',
        nome: 'Adicionais Extras',
        tipo: 'Multipla',
        obrigatorio: false,
        opcoes: [
          { id: 'op-bacon', nome: 'Bacon Crocante', preco: 4.5 },
          { id: 'op-queijo', nome: 'Queijo Extra', preco: 3.0 },
          { id: 'op-ovo', nome: 'Ovo Frito', preco: 2.5 },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-2',
    categoriaId: 'cat-2',
    nome: 'Refrigerante Lata 350ml',
    descricao: 'Coca-Cola, Guaraná ou Soda.',
    precoBase: 6.0,
    disponivel: true,
    gruposAdicionais: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'item-3',
    categoriaId: 'cat-3',
    nome: 'Pudim de Leite',
    descricao: 'Fatia individual de pudim tradicional com calda de caramelo.',
    precoBase: 12.0,
    disponivel: true,
    gruposAdicionais: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function buscarItemCardapioPorId(id: string): ItemCardapio {
  const item = CARDAPIO_MOCK.find((i) => i.id === id);
  if (!item) {
    throw new Error(`Item do cardápio '${id}' não encontrado`);
  }
  return item;
}

export function listarCardapio() {
  return {
    categorias: CATEGORIAS_MOCK,
    itens: CARDAPIO_MOCK.filter((i) => i.disponivel),
  };
}
