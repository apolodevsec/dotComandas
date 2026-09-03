import { describe, it, expect } from 'vitest';
import {
  podeTransicionarPedido,
  podeTransicionarComanda,
  calcularTotalItemPedido,
} from '../state-machine.js';

describe('State Machine & Domain Helper Tests', () => {
  describe('Transições de Pedido', () => {
    it('deve permitir transição válida de Pendente para Em Preparo', () => {
      expect(podeTransicionarPedido('Pendente', 'Em Preparo')).toBe(true);
    });

    it('deve permitir transição válida de Em Preparo para Pronto', () => {
      expect(podeTransicionarPedido('Em Preparo', 'Pronto')).toBe(true);
    });

    it('deve permitir transição válida de Pronto para Entregue', () => {
      expect(podeTransicionarPedido('Pronto', 'Entregue')).toBe(true);
    });

    it('não deve permitir pular de Pendente direto para Entregue', () => {
      expect(podeTransicionarPedido('Pendente', 'Entregue')).toBe(false);
    });

    it('não deve permitir regredir de Entregue para Pendente', () => {
      expect(podeTransicionarPedido('Entregue', 'Pendente')).toBe(false);
    });
  });

  describe('Transições de Comanda', () => {
    it('deve permitir transição de Aberta para Em Atendimento', () => {
      expect(podeTransicionarComanda('Aberta', 'Em Atendimento')).toBe(true);
    });

    it('deve permitir transição para Aguardando Fechamento e depois Fechada', () => {
      expect(podeTransicionarComanda('Em Atendimento', 'Aguardando Fechamento')).toBe(true);
      expect(podeTransicionarComanda('Aguardando Fechamento', 'Fechada')).toBe(true);
    });

    it('não deve permitir reabrir comanda Fechada para Aberta', () => {
      expect(podeTransicionarComanda('Fechada', 'Aberta')).toBe(false);
    });
  });

  describe('Cálculo de Preço de Item do Pedido', () => {
    it('deve calcular corretamente o valor total do item incluindo adicionais e quantidade', () => {
      const precoBase = 25.0; // Hambúrguer
      const quantidade = 2;
      const adicionais = [
        { precoUnitario: 4.0 }, // Bacon
        { precoUnitario: 2.0 }, // Queijo Extra
      ];

      // (25 + 4 + 2) * 2 = 62
      const total = calcularTotalItemPedido(precoBase, quantidade, adicionais);
      expect(total).toBe(62.0);
    });
  });
});
