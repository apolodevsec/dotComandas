import { describe, it, expect } from 'vitest';
import {
  adicionarDigitoPin,
  removerUltimoDigitoPin,
  estaPinCompleto,
} from '../components/PinPad.js';
import {
  montarGradeMapaMesas,
  obterCorETexturaMesa,
} from '../components/MapaMesas.js';
import { Mesa } from '@dotcomandas/shared';

describe('Ticket 11: App Mobile do Garçom - PIN Pad e Mapa de Mesas', () => {
  describe('Teclado PIN Pad (6 dígitos)', () => {
    it('deve acumular dígitos numéricos até 6 posições', () => {
      let pin = '';
      pin = adicionarDigitoPin(pin, '1');
      pin = adicionarDigitoPin(pin, '2');
      pin = adicionarDigitoPin(pin, '3');
      expect(pin).toBe('123');
      expect(estaPinCompleto(pin)).toBe(false);

      pin = adicionarDigitoPin(pin, '4');
      pin = adicionarDigitoPin(pin, '5');
      pin = adicionarDigitoPin(pin, '6');
      expect(pin).toBe('123456');
      expect(estaPinCompleto(pin)).toBe(true);

      // Não deve aceitar 7º dígito
      pin = adicionarDigitoPin(pin, '7');
      expect(pin).toBe('123456');
    });

    it('deve permitir remover último dígito', () => {
      let pin = '1234';
      pin = removerUltimoDigitoPin(pin);
      expect(pin).toBe('123');
    });
  });

  describe('Mapa de Mesas por Cores', () => {
    it('deve atribuir cores corretas baseadas no status da mesa e estado da comanda', () => {
      const mesasMock: Mesa[] = [
        { id: 'm1', numero: 1, qrCodeUrl: '', status: 'Livre', createdAt: '', updatedAt: '' },
        { id: 'm2', numero: 2, qrCodeUrl: '', status: 'Ocupada', createdAt: '', updatedAt: '' },
        { id: 'm3', numero: 3, qrCodeUrl: '', status: 'Ocupada', createdAt: '', updatedAt: '' },
      ];

      const comandasAtivas = [
        { mesaId: 'm2', estado: 'Em Atendimento' as const },
        { mesaId: 'm3', estado: 'Aguardando Fechamento' as const },
      ];

      const grade = montarGradeMapaMesas(mesasMock, comandasAtivas);

      // Mesa 1: Livre -> Verde
      expect(grade[0].corStatus).toBe('#22c55e');

      // Mesa 2: Em Atendimento -> Vermelho
      expect(grade[1].corStatus).toBe('#ef4444');

      // Mesa 3: Aguardando Fechamento -> Amarelo
      expect(grade[2].corStatus).toBe('#eab308');
    });

    it('deve destacar mesas em amarelo com alerta piscante e sinal sonoro quando houver chamado ativo', () => {
      const mesasMock: Mesa[] = [
        { id: 'm1', numero: 1, qrCodeUrl: '', status: 'Ocupada', createdAt: '', updatedAt: '' },
        { id: 'm2', numero: 2, qrCodeUrl: '', status: 'Ocupada', createdAt: '', updatedAt: '' },
      ];

      const comandasAtivas = [
        { mesaId: 'm1', estado: 'Em Atendimento' as const },
        { mesaId: 'm2', estado: 'Em Atendimento' as const },
      ];

      const chamadosAtivos = [
        { mesaId: 'm2', tipo: 'atendimento' as const },
      ];

      const grade = montarGradeMapaMesas(mesasMock, comandasAtivas, chamadosAtivos);

      // Mesa 1 sem chamado: Em Atendimento -> Vermelho tradicional
      expect(grade[0].alertaPiscante).toBe(false);
      expect(grade[0].corStatus).toBe('#ef4444');

      // Mesa 2 com chamado de atendimento: Alerta Amarelo Piscante + Efeito Sonoro
      expect(grade[1].alertaPiscante).toBe(true);
      expect(grade[1].labelStatus).toBe('🟡 Aguardando Atendimento');
      expect(grade[1].corStatus).toBe('#f59e0b');
      expect(grade[1].efeitoSonoro).toBe(true);
    });
  });
});
