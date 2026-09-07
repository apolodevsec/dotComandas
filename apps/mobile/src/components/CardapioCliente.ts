export type CategoriaCardapio = 'Entradas' | 'Pratos' | 'Bebidas' | 'Sobremesas' | string;

export interface OpcaoAdicional {
  id: string;
  nome: string;
  precoAdicional: number;
}

export interface GrupoAdicionais {
  id: string;
  nome: string;
  obrigatorio: boolean;
  opcoes: OpcaoAdicional[];
}

export interface ItemCardapioCliente {
  id: string;
  nome: string;
  categoria: CategoriaCardapio;
  precoBase: number;
  descricao?: string;
  imagemUrl?: string;
  gruposAdicionais: GrupoAdicionais[];
}

export interface EscolhaAdicional {
  grupoId: string;
  opcaoId: string;
  precoAdicional: number;
}

export interface ResultadoValidacaoCustomizacao {
  valido: boolean;
  mensagemErro?: string;
}

export interface ToastNotificacaoStatus {
  icone: string;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'alerta';
}

/**
 * Filtra os itens do cardápio pela categoria selecionada.
 */
export function filtrarCardapioPorCategoria(
  itens: ItemCardapioCliente[],
  categoria: CategoriaCardapio
): ItemCardapioCliente[] {
  return itens.filter((item) => item.categoria === categoria);
}

/**
 * Calcula o preço total de um item considerando o preço base e adicionais selecionados no Bottom Sheet.
 */
export function calcularPrecoComCustomizacao(
  item: ItemCardapioCliente,
  escolhas: EscolhaAdicional[]
): number {
  const custoAdicionais = escolhas.reduce((acc, escolha) => acc + escolha.precoAdicional, 0);
  return item.precoBase + custoAdicionais;
}

/**
 * Valida se todos os grupos de adicionais obrigatórios do item possuem uma escolha correspondente.
 */
export function validarOpcoesObrigatorias(
  item: ItemCardapioCliente,
  escolhas: EscolhaAdicional[]
): ResultadoValidacaoCustomizacao {
  for (const grupo of item.gruposAdicionais) {
    if (grupo.obrigatorio) {
      const possuiEscolha = escolhas.some((e) => e.grupoId === grupo.id);
      if (!possuiEscolha) {
        return {
          valido: false,
          mensagemErro: `Por favor, selecione uma opção obrigatória para: ${grupo.nome}`,
        };
      }
    }
  }
  return { valido: true };
}

/**
 * Gera os dados formatados para a exibição de Toast flutuante de alteração de status do pedido em tempo real.
 */
export function gerarToastNotificacaoStatus(
  itemNome: string,
  novoStatus: string
): ToastNotificacaoStatus {
  switch (novoStatus) {
    case 'Em Preparo':
      return {
        icone: '👨‍🍳',
        mensagem: `Seu prato "${itemNome}" está em preparo na cozinha!`,
        tipo: 'info',
      };
    case 'Pronto':
      return {
        icone: '🍽️',
        mensagem: `Seu prato "${itemNome}" está pronto e a caminho da mesa!`,
        tipo: 'sucesso',
      };
    case 'Entregue':
      return {
        icone: '✅',
        mensagem: `Bom apetite! O prato "${itemNome}" foi entregue.`,
        tipo: 'sucesso',
      };
    default:
      return {
        icone: '⌛',
        mensagem: `Pedido do prato "${itemNome}" recebido com sucesso.`,
        tipo: 'info',
      };
  }
}
