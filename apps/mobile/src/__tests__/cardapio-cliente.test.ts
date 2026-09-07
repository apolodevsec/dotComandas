import { describe, it, expect } from 'vitest';
import {
  filtrarCardapioPorCategoria,
  calcularPrecoComCustomizacao,
  validarOpcoesObrigatorias,
  gerarToastNotificacaoStatus,
  ItemCardapioCliente,
  EscolhaAdicional,
} from '../components/CardapioCliente.js';

describe('Ticket 18: Interface do Cardápio do Cliente (PWA) e Modal Bottom Sheet', () => {
  const itensMock: ItemCardapioCliente[] = [
    {
      id: 'i1',
      nome: 'Carpaccio de Polvo',
      categoria: 'Entradas',
      precoBase: 68.0,
      gruposAdicionais: [],
    },
    {
      id: 'i2',
      nome: 'Ancho Wagyu 300g',
      categoria: 'Pratos',
      precoBase: 145.0,
      gruposAdicionais: [
        {
          id: 'g1',
          nome: 'Ponto da Carne',
          obrigatorio: true,
          opcoes: [
            { id: 'o1', nome: 'Ao Ponto', precoAdicional: 0 },
            { id: 'o2', nome: 'Mal Passado', precoAdicional: 0 },
          ],
        },
        {
          id: 'g2',
          nome: 'Molhos Especiais',
          obrigatorio: false,
          opcoes: [
            { id: 'o3', nome: 'Molho Trufado', precoAdicional: 18.0 },
            { id: 'o4', nome: 'Manteiga de Ervas', precoAdicional: 12.0 },
          ],
        },
      ],
    },
    {
      id: 'i3',
      nome: 'Vinho Brunello di Montalcino',
      categoria: 'Bebidas',
      precoBase: 480.0,
      gruposAdicionais: [],
    },
    {
      id: 'i4',
      nome: 'Petit Gâteau Gold',
      categoria: 'Sobremesas',
      precoBase: 42.0,
      gruposAdicionais: [],
    },
  ];

  it('deve filtrar os itens do cardápio pela categoria tradicional selecionada', () => {
    const entradas = filtrarCardapioPorCategoria(itensMock, 'Entradas');
    expect(entradas.length).toBe(1);
    expect(entradas[0].nome).toBe('Carpaccio de Polvo');

    const pratos = filtrarCardapioPorCategoria(itensMock, 'Pratos');
    expect(pratos.length).toBe(1);
    expect(pratos[0].nome).toBe('Ancho Wagyu 300g');
  });

  it('deve calcular corretamente o preço total incluindo adicionais selecionados no Bottom Sheet', () => {
    const itemAncho = itensMock[1];
    const escolhas: EscolhaAdicional[] = [
      { grupoId: 'g1', opcaoId: 'o1', precoAdicional: 0 },
      { grupoId: 'g2', opcaoId: 'o3', precoAdicional: 18.0 },
    ];

    const precoTotal = calcularPrecoComCustomizacao(itemAncho, escolhas);
    expect(precoTotal).toBe(163.0); // 145.0 + 18.0
  });

  it('deve validar se grupos obrigatorios foram selecionados antes de adicionar ao carrinho', () => {
    const itemAncho = itensMock[1];

    // Sem a escolha obrigatoria do ponto da carne
    const resultadoInvalido = validarOpcoesObrigatorias(itemAncho, []);
    expect(resultadoInvalido.valido).toBe(false);
    expect(resultadoInvalido.mensagemErro).toContain('Ponto da Carne');

    // Com a escolha obrigatoria feita
    const resultadoValido = validarOpcoesObrigatorias(itemAncho, [
      { grupoId: 'g1', opcaoId: 'o1', precoAdicional: 0 },
    ]);
    expect(resultadoValido.valido).toBe(true);
  });

  it('deve gerar mensagens de Toast flutuante animado ao mudar o status do pedido', () => {
    const toastPreparando = gerarToastNotificacaoStatus('Ancho Wagyu 300g', 'Em Preparo');
    expect(toastPreparando.icone).toBe('👨‍🍳');
    expect(toastPreparando.mensagem).toBe('Seu prato "Ancho Wagyu 300g" está em preparo na cozinha!');

    const toastPronto = gerarToastNotificacaoStatus('Ancho Wagyu 300g', 'Pronto');
    expect(toastPronto.icone).toBe('🍽️');
    expect(toastPronto.mensagem).toBe('Seu prato "Ancho Wagyu 300g" está pronto e a caminho da mesa!');
  });
});
