import { describe, it, expect } from 'vitest';
import {
  autenticarFuncionarioPorPin,
  verificarTokenStaff,
  validarPermissaoRBAC,
} from '../services/auth-service.js';
import {
  iniciarSessaoMesaPorQrCode,
  verificarTokenSessaoMesa,
} from '../services/mesa-service.js';

describe('Ticket 02 & 03: Autenticação, PIN RBAC e Sessão de Mesa', () => {
  describe('Ticket 02: Sessão de Mesa via QR Code', () => {
    it('deve gerar uma Sessão de Mesa válida a partir do ID da mesa', () => {
      const resultado = iniciarSessaoMesaPorQrCode('mesa-1');
      expect(resultado.token).toBeDefined();
      expect(resultado.mesa.numero).toBe(1);

      const decoded = verificarTokenSessaoMesa(resultado.token);
      expect(decoded.mesaId).toBe('mesa-1');
      expect(decoded.numeroMesa).toBe(1);
    });

    it('deve aceitar URL completa do QR Code', () => {
      const resultado = iniciarSessaoMesaPorQrCode('https://dotcomandas.app/qr/mesa-2');
      expect(resultado.mesa.id).toBe('mesa-2');
      expect(resultado.mesa.numero).toBe(2);
    });

    it('deve lançar erro se a mesa não existir', () => {
      expect(() => iniciarSessaoMesaPorQrCode('mesa-inexistente')).toThrowError(
        'Mesa não encontrada'
      );
    });
  });

  describe('Ticket 03: Autenticação de Funcionário com PIN (6 dígitos) e RBAC', () => {
    it('deve autenticar Garçom com PIN correto de 6 dígitos', () => {
      const resultado = autenticarFuncionarioPorPin('garcom1', '123456');
      expect(resultado.token).toBeDefined();
      expect(resultado.funcionario.nome).toBe('Carlos Silva');
      expect(resultado.funcionario.papel).toBe('Garcom');

      const decoded = verificarTokenStaff(resultado.token);
      expect(decoded.usuario).toBe('garcom1');
      expect(decoded.papel).toBe('Garcom');
    });

    it('deve rejeitar PIN incorreto', () => {
      expect(() => autenticarFuncionarioPorPin('garcom1', '000000')).toThrowError(
        'PIN inválido'
      );
    });

    it('deve validar permissões de acesso por Papel (RBAC)', () => {
      expect(validarPermissaoRBAC('Garcom', ['Garcom', 'Caixa'])).toBe(true);
      expect(validarPermissaoRBAC('Cozinha', ['Garcom', 'Caixa'])).toBe(false);
      expect(validarPermissaoRBAC('Admin', ['Garcom'])).toBe(true); // Admin acessa tudo
    });
  });
});
