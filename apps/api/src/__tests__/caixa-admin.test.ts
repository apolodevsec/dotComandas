import { describe, it, expect, beforeEach, vi } from 'vitest';
import { criarPedido, limparBancoDeDadosMemoria } from '../services/pedido-service.js';
import {
  obterResumoCaixaComanda,
  aplicarDescontoETaxaComanda,
  registrarPagamentoEFecharComanda,
  caixaEvents,
} from '../services/caixa-service.js';
import {
  criarFuncionarioAdmin,
  criarItemCardapioAdmin,
  listarFuncionariosAdmin,
} from '../services/admin-service.js';
import { buscarMesaPorId } from '../services/mesa-service.js';

describe('Ticket 07 & 08: Fechamento de Caixa e Painel Administrativo', () => {
  beforeEach(() => {
    limparBancoDeDadosMemoria();
  });

  describe('Ticket 07: Fechamento de Comanda e Pagamento no Caixa', () => {
    it('deve calcular o resumo da comanda, aplicar taxa/desconto e registrar pagamento fechando a comanda', () => {
      const escutadorCaixa = vi.fn();
      caixaEvents.on('caixa:event', escutadorCaixa);

      // Criar pedido de R$ 28.00 na mesa 1
      const { comanda } = criarPedido(
        'mesa-1',
        [{ itemCardapioId: 'item-1', quantidade: 1, opcoesSelecionadasIds: ['op-ponto'] }],
        'Cliente'
      );

      const resumoInicial = obterResumoCaixaComanda(comanda.id);
      expect(resumoInicial.subtotal).toBe(28.0);

      // Aplicar R$ 2.00 de desconto e R$ 2.80 de taxa de serviço
      const comandaComDesconto = aplicarDescontoETaxaComanda(comanda.id, 2.0, 2.8);
      // Total = 28.0 - 2.0 + 2.8 = 28.80
      expect(comandaComDesconto.total).toBe(28.8);

      // Registrar pagamento em Pix
      const resultadoPagamento = registrarPagamentoEFecharComanda(
        comanda.id,
        'Pix',
        30.0,
        'func-3' // operador de caixa
      );

      expect(resultadoPagamento.comanda.estado).toBe('Fechada');
      expect(resultadoPagamento.pagamento.formaPagamento).toBe('Pix');

      // Mesa 1 deve estar Livre
      const mesa = buscarMesaPorId('mesa-1');
      expect(mesa.status).toBe('Livre');

      expect(escutadorCaixa).toHaveBeenCalledTimes(1);
      caixaEvents.off('caixa:event', escutadorCaixa);
    });

    it('deve rejeitar pagamento com valor inferior ao total da comanda', () => {
      const { comanda } = criarPedido(
        'mesa-1',
        [{ itemCardapioId: 'item-2', quantidade: 2 }], // 6 * 2 = 12.00
        'Cliente'
      );

      expect(() =>
        registrarPagamentoEFecharComanda(comanda.id, 'Dinheiro', 10.0, 'func-3')
      ).toThrowError(/Valor pago R\$ 10.00 é inferior ao total da comanda/);
    });
  });

  describe('Ticket 08: Gestão Administrativa de Cardápio e Funcionários', () => {
    it('deve criar novo funcionário com validação rigorosa de PIN de 6 dígitos', () => {
      const novoGarcom = criarFuncionarioAdmin({
        nome: 'João Garçom',
        usuario: 'joao.garcom',
        pin: '654321',
        papel: 'Garcom',
      });

      expect(novoGarcom.id).toBeDefined();
      expect(novoGarcom.papel).toBe('Garcom');

      const funcionarios = listarFuncionariosAdmin();
      expect(funcionarios.some((f) => f.usuario === 'joao.garcom')).toBe(true);
    });

    it('deve rejeitar criação de funcionário com PIN inválido (não contendo 6 dígitos numéricos)', () => {
      expect(() =>
        criarFuncionarioAdmin({
          nome: 'Invalido',
          usuario: 'inv',
          pin: '123', // apenas 3 digitos
          papel: 'Garcom',
        })
      ).toThrowError('O PIN do funcionário deve conter exatamente 6 dígitos numéricos');
    });

    it('deve criar novo item do cardápio via painel Admin', () => {
      const novoItem = criarItemCardapioAdmin({
        categoriaId: 'cat-1',
        nome: 'Suco Natural Laranja 500ml',
        descricao: 'Suco de laranja natural feito na hora.',
        precoBase: 9.5,
        disponivel: true,
        gruposAdicionais: [],
      });

      expect(novoItem.id).toBeDefined();
      expect(novoItem.nome).toBe('Suco Natural Laranja 500ml');
    });
  });
});
